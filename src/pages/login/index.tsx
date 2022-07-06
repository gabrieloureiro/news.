import Head from "next/head";
import * as C from "@chakra-ui/react";
import { Input } from "components";
import { useIntl } from "react-intl";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "context/AuthContext";
import Link from "next/link";
import { withSSRGuest } from "utils/auth/withSSRGuest";

export default function LoginComponent(): JSX.Element {
  const { formatMessage } = useIntl();
  const { signIn, signInFormSchema } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signInFormSchema),
  });

  return (
    <>
      <Head>
        <title>{formatMessage({ id: "page.login.title" })} | news.</title>
        <meta
          name="description"
          content={formatMessage({ id: "page.login.title.business" })}
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
            {formatMessage({ id: "page.login.title" })}
          </C.Heading>
          <C.VStack as="form" spacing="16px" onSubmit={handleSubmit(signIn)}>
            <Input
              name="email"
              type="email"
              error={errors.email}
              label={formatMessage({ id: "page.login.form.label.email" })}
              {...register("email")}
            />
            <Input
              autoComplete="current-password"
              name="password"
              error={errors.password}
              {...register("password")}
              label={formatMessage({
                id: "page.login.form.label.password",
              })}
            />
            <Link href="/forgot-password" passHref>
              <C.Link alignSelf="flex-start" color="white.400">
                {formatMessage({
                  id: "page.login.form.link.forget-password",
                })}
              </C.Link>
            </Link>
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
              {formatMessage({ id: "page.login.form.button.submit" })}
            </C.Button>
          </C.VStack>
          <C.Flex
            wrap="wrap"
            justify="center"
            align="center"
            mt="16px"
            sx={{
              "@media (max-width: 251px)": {
                flexDirection: "column",
              },
            }}
          >
            <C.Text
              mr="12px"
              sx={{
                "@media (max-width: 251px)": {
                  mr: "0",
                },
              }}
            >
              {formatMessage({ id: "page.login.label.without-account" })}
            </C.Text>
            <Link href="/signup" passHref>
              <C.Link color="yellow.500">
                {formatMessage({ id: "page.login.link.sign-up" })}
              </C.Link>
            </Link>
          </C.Flex>
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
