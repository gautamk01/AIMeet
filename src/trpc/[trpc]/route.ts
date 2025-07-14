import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../routers/_app';
import { createTRPCContext } from '../init';

const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext: createTRPCContext,
    });
export { handler as GET, handler as POST };