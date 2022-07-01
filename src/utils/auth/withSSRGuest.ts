import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { parseCookies } from "nookies";

const UNLOGGED_ROUTES = {
  LOGIN: "/login",
  SIGN_UP: "/signup",
};

export function withSSRGuest<P>(fn: GetServerSideProps<P>): GetServerSideProps {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const { access_token } = parseCookies(ctx);

    const isUnloggedRoute =
      ctx.resolvedUrl === UNLOGGED_ROUTES.LOGIN ||
      ctx.resolvedUrl === UNLOGGED_ROUTES.SIGN_UP;

    if (access_token && isUnloggedRoute) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return await fn(ctx);
  };
}
