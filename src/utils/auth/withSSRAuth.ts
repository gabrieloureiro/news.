import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { parseCookies } from "nookies";
import decode from "jwt-decode";
import { DecodedToken } from "context";
import { validateUserRoles } from "./validateUserRoles";

interface WithSSRAuthOptions {
  roles: string[];
}

export function withSSRAuth<P>(
  fn: GetServerSideProps<P>,
  options?: WithSSRAuthOptions
): GetServerSideProps {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const { access_token } = parseCookies(ctx);

    if (!access_token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    if (options) {
      const authenticatedUser: DecodedToken = decode(access_token);
      const { roles } = options;
      const userHasValidRole = validateUserRoles({
        authenticatedUser,
        roles,
      });

      if (!userHasValidRole) {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
    }

    return await fn(ctx);
  };
}
