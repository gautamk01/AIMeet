import db from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { TRPCError } from "@trpc/server";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schemas";
import { MeetingStatus } from "../types";
import { streamVideo } from "@/lib/stream-video";
import { generateAvatarUri } from "@/lib/avatar";


export const meetingsRouter = createTRPCRouter({

    generateToken: protectedProcedure.mutation(async ({ ctx }) => {
        await streamVideo.upsertUsers([{
            id: ctx.auth.user.id,
            name: ctx.auth.user.name,
            role: "admin",
            image: ctx.auth.user.image ?? generateAvatarUri({ seed: ctx.auth.user.name, variant: "initials" })
        }]);

        const expirationTime = Math.floor(Date.now() / 100) + 3600; // 1hr
        const issusedAt = Math.floor(Date.now() / 1000) - 60;

        const token = streamVideo.generateUserToken({
            user_id: ctx.auth.user.id,
            exp: expirationTime,
            validity_in_seconds: issusedAt

        })

        return token
    }),

    //remove Meeting Procedure 
    remove: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
        const [removedMeeting] = await db.delete(meetings).where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))).returning();
        if (!removedMeeting) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Update Meeting not found" })
        }

        return removedMeeting;
    }),
    //update Meeting Procedure 
    update: protectedProcedure.input(meetingsUpdateSchema).mutation(async ({ ctx, input }) => {
        const [updateMeeting] = await db.update(meetings).set(input).where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))).returning();
        if (!updateMeeting) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" })
        }

        return updateMeeting;
    }),


    //Create Meeting Procedure 
    create: protectedProcedure.input(meetingsInsertSchema).mutation(async ({ input, ctx }) => {
        const [createdMeetings] = await db.insert(meetings).values({ ...input, userId: ctx.auth.user.id }).returning();

        //TODO : create stream call , upsert Stream user
        const call = streamVideo.video.call("default", createdMeetings.id);
        await call.create({
            data: {
                created_by_id: ctx.auth.user.id,
                custom: {
                    meetingId: createdMeetings.id,
                    meetingName: createdMeetings.name
                },
                settings_override: {
                    transcription: {
                        language: "en",
                        mode: "auto-on",
                        closed_caption_mode: "auto-on"
                    },
                    recording: {
                        mode: "auto-on",
                        quality: "1080p"
                    },
                },


            }
        });


        const [existingAgent] = await db.select().from(agents).where(eq(agents.id, createdMeetings.agentId));

        if (!existingAgent) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Agent not found"
            })
        }

        await streamVideo.upsertUsers([
            {
                id: existingAgent.id,
                name: existingAgent.name, role: "user",
                image: generateAvatarUri({
                    seed: existingAgent.name,
                    variant: "botttsNeutral"
                })
            }
        ])
        return createdMeetings;
    }),

    //  This create procedure does three main things:
    // DB Insert → Saves the meeting in your database.
    // Stream Setup → Creates a corresponding video call with transcription & recording.
    // Agent Linking → Ensures the related agent exists and is registered as a Stream user.


    //Getone Meeting Procedure
    //from this we are getting the inital values the update form will be populated with 
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
        const [existingMeeting] = await db.select({
            ...getTableColumns(meetings)
            , agent: agents,
            duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
        }).from(meetings)
            .innerJoin(agents, eq(meetings.agentId, agents.id)).where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)))
        //Find the agent with this specific ID, but only return it if it belongs to this specific user." 
        //This prevents any user from being able to access another user's data, even if they guess a valid agent ID. 🔐
        if (!existingMeeting) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" })
        }
        return existingMeeting;
    }),


    //Get all meeting procedure
    //TODO: protected procedure needed to be setup
    //we have added some fileter options and it is optional 
    getMany: protectedProcedure.input(
        z.object({
            page: z.number().int().min(DEFAULT_PAGE).default(DEFAULT_PAGE),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
            search: z.string().nullish(),
            agentId: z.string().nullish(),
            status: z.enum([MeetingStatus.Upcoming, MeetingStatus.Active, MeetingStatus.Completed, MeetingStatus.Processing, MeetingStatus.Cancelled]).nullish()
        })
    ).query(async ({ ctx, input }) => {
        const { search, page, pageSize, status, agentId } = input;
        const data = await db
            .select({
                ...getTableColumns(meetings),
                agent: agents,
                duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
            }).from(meetings).innerJoin(agents, eq(meetings.agentId, agents.id))
            .where(and(eq(meetings.userId, ctx.auth.user.id),
                search ? ilike(meetings.name, `%${search}%`) : undefined,
                status ? eq(meetings.status, status) : undefined,
                agentId ? eq(meetings.agentId, agentId) : undefined
            )).orderBy(desc(meetings.createdAt), desc(meetings.id))
            .limit(pageSize)
            .offset((page - 1) * pageSize)

        const [total] = await db
            .select({
                count: count()
            })
            .from(meetings)
            .innerJoin(agents, eq(meetings.agentId, agents.id))
            .where(
                and(eq(meetings.userId, ctx.auth.user.id),
                    search ? ilike(meetings.name, `%${search}%`) : undefined,
                    status ? eq(meetings.status, status) : undefined,
                    agentId ? eq(meetings.agentId, agentId) : undefined
                )
            );

        const totalPages = Math.ceil(total.count / pageSize);


        return {
            items: data,
            total: total.count,
            totalPages,
        }
    }),

})