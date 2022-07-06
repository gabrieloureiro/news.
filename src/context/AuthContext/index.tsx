import apiClient from "services/apiClient";
import Router from "next/router";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";
import * as yup from "yup";
import { SubmitHandler } from "react-hook-form";
import { useIntl } from "react-intl";
import decode from "jwt-decode";
import { Role } from "types";
import { MAX_AGE } from "@constants";
import * as C from "@chakra-ui/react";

export type SignInCredentials = {
  email: string;
  password: string;
};

export type AuthenticatedUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export type DecodedToken = AuthenticatedUser;

type AuthLoginApiResponse = {
  token: string;
};

export type SignUpCredentials = {
  email: string;
  name: string;
  password: string;
  password_confirmation: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

type AuthContextInterface = {
  authenticatedUser: AuthenticatedUser;
  signIn(credentials: SignInCredentials): Promise<void>;
  signInFormSchema: yup.ObjectSchema<any, any>;
  signUp(credentials: SignUpCredentials): Promise<void>;
  signUpFormSchema: yup.ObjectSchema<any, any>;
  isAuthenticated: boolean;
  signOut(): void;
};

const AuthContext = createContext({} as AuthContextInterface);

export const useAuth = (): AuthContextInterface => useContext(AuthContext);

export function signOut(): void {
  destroyCookie(undefined, "access_token");
  Router.push("/login");
}

function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const { access_token } = parseCookies();
  const toast = C.useToast();
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser>(
    {} as AuthenticatedUser
  );
  const { formatMessage } = useIntl();
  const isAuthenticated = !!authenticatedUser;

  const signInFormSchema = yup.object().shape({
    email: yup
      .string()
      .required(formatMessage({ id: "page.login.form.error.required.email" }))
      .email(formatMessage({ id: "page.login.form.error.email" })),
    password: yup
      .string()
      .required(
        formatMessage({ id: "page.login.form.error.required.password" })
      ),
  });

  const signUpFormSchema = yup.object().shape({
    name: yup
      .string()
      .required(formatMessage({ id: "page.signup.form.error.required.name" })),
    email: yup
      .string()
      .required(formatMessage({ id: "page.signup.form.error.required.email" }))
      .email(formatMessage({ id: "page.signup.form.error.email" })),
    password: yup
      .string()
      .required(
        formatMessage({ id: "page.signup.form.error.required.password" })
      )
      .min(6, formatMessage({ id: "page.signup.form.error.min.password" }))
      .max(20, formatMessage({ id: "page.signup.form.error.max.password" })),
    password_confirmation: yup
      .string()
      .required(
        formatMessage({
          id: "page.signup.form.error.required.password_confirmation",
        })
      )
      .oneOf(
        [null, yup.ref("password")],
        formatMessage({ id: "page.signup.form.error.password_confirmation" })
      ),
  });

  const signIn: SubmitHandler<SignInCredentials> = async ({
    email,
    password,
  }) => {
    try {
      const response = await apiClient.post<AuthLoginApiResponse>("/auth", {
        email,
        password,
      });

      const { token } = response.data;

      setCookie(undefined, "access_token", token, {
        maxAge: MAX_AGE,
        path: "/",
      });

      const decodedToken: DecodedToken = decode(token);

      setAuthenticatedUser(decodedToken);

      if (response.status === 200) {
        Router.push("/");
        toast({
          title: formatMessage({ id: "toast.login.success" }),
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (err) {
      toast({
        title: formatMessage({ id: "toast.login.error" }),
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const signUp: SubmitHandler<SignUpCredentials> = async ({
    name,
    email,
    password,
  }) => {
    try {
      const { status } = await apiClient.post<SignUpCredentials>("/users", {
        name,
        email,
        password,
      });

      if (status === 201) {
        if (isAuthenticated || !!authenticatedUser) {
          signOut();
        }
        Router.push("/login");
        toast({
          title: formatMessage({ id: "toast.signup.success" }),
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (err) {
      toast({
        title: formatMessage({ id: "toast.signup.error" }),
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    if (access_token && !authenticatedUser.id) {
      const { id }: DecodedToken = decode(access_token);
      apiClient
        .get<AuthenticatedUser>(`/users/${id}`)
        .then((response) => {
          const currentAuthenticatedUser = response.data;
          setAuthenticatedUser(currentAuthenticatedUser);
        })
        .catch(() => {
          signOut();
        });
    }
  }, [access_token, authenticatedUser, signOut]);

  useEffect(() => {
    if (!access_token) {
      signOut();
    }
  }, [access_token, signOut]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authenticatedUser,
        signIn,
        signInFormSchema,
        signUp,
        signUpFormSchema,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
