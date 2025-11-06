import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  dashboard: router({
    getEconomicData: publicProcedure.query(async () => {
      const { getAllEconomicData } = await import("./db");
      return getAllEconomicData();
    }),
    getCountryData: publicProcedure.input((val: any) => {
      if (typeof val !== "string") throw new Error("Country code must be a string");
      return val;
    }).query(async ({ input }) => {
      const { getEconomicDataByCountry } = await import("./db");
      return getEconomicDataByCountry(input);
    }),
    getIndicatorData: publicProcedure.input((val: any) => {
      if (typeof val !== "string") throw new Error("Indicator code must be a string");
      return val;
    }).query(async ({ input }) => {
      const { getEconomicDataByIndicator } = await import("./db");
      return getEconomicDataByIndicator(input);
    }),
    getAnalysisResults: publicProcedure.input((val: any) => {
      return {
        analysisType: val?.analysisType as string | undefined,
        targetCode: val?.targetCode as string | undefined,
      };
    }).query(async ({ input }) => {
      const { getAIAnalysisResults } = await import("./db");
      return getAIAnalysisResults(input.analysisType, input.targetCode);
    }),
  }),
});

export type AppRouter = typeof appRouter;
