import Head from "next/head";
import * as C from "@chakra-ui/react";
import { Input } from "components";
import { useIntl } from "react-intl";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "context/AuthContext";
import { withSSRGuest } from "utils/auth/withSSRGuest";

export default function SignUpComponent(): JSX.Element {
  const { formatMessage } = useIntl();
  const { signUp, signUpFormSchema } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signUpFormSchema),
  });

  return (
    <>
      <Head>
        <title>{formatMessage({ id: "page.signup.title" })} | news.</title>
        <meta
          name="description"
          content={formatMessage({ id: "page.signup.title.business" })}
        ></meta>
      </Head>
      <C.Center
        minH="100vh"
        py="20px"
        px={["20px", "40px"]}
        flex="1"
        bg="transparent"
      >
        <C.Box maxW="100%" w="480px">
          <C.Heading color="white.400" mb="32px">
            {formatMessage({ id: "page.signup.title" })}
          </C.Heading>
          <C.VStack as="form" spacing="16px" onSubmit={handleSubmit(signUp)}>
            <Input
              name="name"
              type="name"
              error={errors.name}
              label={formatMessage({ id: "page.signup.form.label.name" })}
              {...register("name")}
            />
            <Input
              name="email"
              type="email"
              error={errors.email}
              label={formatMessage({ id: "page.signup.form.label.email" })}
              {...register("email")}
            />
            <Input
              autoComplete="current-password"
              name="password"
              error={errors.password}
              {...register("password")}
              label={formatMessage({
                id: "page.signup.form.label.password",
              })}
            />
            <Input
              autoComplete="on"
              name="password_confirmation"
              error={errors.password_confirmation}
              {...register("password_confirmation")}
              label={formatMessage({
                id: "page.signup.form.label.password_confirmation",
              })}
            />
            <C.Button
              variant="solid"
              bg="yellow.400"
              _hover={{
                bg: "yellow.500",
              }}
              fontSize={["12px", "16px"]}
              h={["auto", "56px"]}
              p="12px"
              width="100%"
              type="submit"
              isLoading={isSubmitting}
            >
              {formatMessage({ id: "page.signup.form.button.submit" })}
            </C.Button>
          </C.VStack>
        </C.Box>
      </C.Center>
    </>
  );
}

export const getServerSideProps = withSSRGuest(async () => {
  return {
    props: {},
  };
});
