import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";

//return of api is more important than the db type
export type AgentGetOne = inferRouterOutputs<AppRouter>['agents']['getOne']
export type AgentGetMany = inferRouterOutputs<AppRouter>['agents']['getMany']['items']