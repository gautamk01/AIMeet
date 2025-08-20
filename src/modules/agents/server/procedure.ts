import db from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schema";
import { z } from "zod";
import { eq } from "drizzle-orm";


export const agentRouter = createTRPCRouter({

    //from this we are getting the inital values the update form will be populated with 
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
        const [existingAgent] = await db.select().from(agents).where(eq(agents.id, input.id))
        return existingAgent;
    }),


    //TODO: protected procedure needed to be setup
    getMany: protectedProcedure.query(async () => {
        const data = await db
            .select().from(agents)
        return data
    }),

    //only authenticated user can use it , this for createing a agent in the webapp and there is a input schema 
    //mutation is for  write operation to create a new agent in the database. like put,post 
    //after the insert the result is returned 
    create: protectedProcedure.input(agentsInsertSchema).mutation(async ({ input, ctx }) => {
        const [createAgent] = await db.insert(agents).values({ ...input, userId: ctx.auth.user.id }).returning();
        return createAgent
    })
})