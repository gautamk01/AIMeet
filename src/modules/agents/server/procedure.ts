import db from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schema";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";


export const agentRouter = createTRPCRouter({

    //from this we are getting the inital values the update form will be populated with 
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
        const [existingAgent] = await db.select({
            meetingCount: sql<number>`5`, ...getTableColumns(agents)
        }).from(agents).where(eq(agents.id, input.id))
        return existingAgent;
    }),


    //TODO: protected procedure needed to be setup
    //we have added some fileter options and it is optional 
    getMany: protectedProcedure.input(
        z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
            search: z.string().nullish()
        })
    ).query(async ({ ctx, input }) => {
        const { search, page, pageSize } = input;
        const data = await db
            .select({
                meetingCount: sql<number>`5`, ...getTableColumns(agents)
            }).from(agents).where(and(eq(agents.userId, ctx.auth.user.id),
                search ? ilike(agents.name, `%${search}%`) : undefined,
            )).orderBy(desc(agents.createdAt), desc(agents.id))
            .limit(pageSize)
            .offset((page - 1) * pageSize)

        const [total] = await db
            .select({
                count: count()
            })
            .from(agents)
            .where(
                and(eq(agents.userId, ctx.auth.user.id),
                    search ? ilike(agents.name, `%${search}%`) : undefined,
                )
            );

        const totalPages = Math.ceil(total.count / pageSize);


        return {
            items: data,
            total: total.count,
            totalPages,
        }
    }),

    //only authenticated user can use it , this for createing a agent in the webapp and there is a input schema 
    //mutation is for  write operation to create a new agent in the database. like put,post 
    //after the insert the result is returned 
    create: protectedProcedure.input(agentsInsertSchema).mutation(async ({ input, ctx }) => {
        const [createAgent] = await db.insert(agents).values({ ...input, userId: ctx.auth.user.id }).returning();
        return createAgent
    })
})