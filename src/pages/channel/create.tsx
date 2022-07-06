import { ROLES } from "@constants";
import { Input, Layout, Title } from "components";
import { withSSRAuth } from "utils/auth/withSSRAuth";
import * as C from "@chakra-ui/react";
import { useIntl } from "react-intl";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreateChannel } from "hooks/channel";
import { ChannelPayload } from "types";
import { useAuth } from "context";
import { motion } from "framer-motion";
import { CARDS_ANIMATION, TRANSITION } from "animations";
import { useRouter } from "next/router";

const MotionFlex = motion<Omit<C.FlexProps, "transition">>(C.Flex);

const CreateChannel = () => {
  const { push } = useRouter();
  const { formatMessage } = useIntl();
  const createChannelFormSchema = yup.object().shape({
    title: yup
      .string()
      .required(
        formatMessage({ id: "page.channel-create.form.error.required.name" })
      ),
    description: yup.string().required(
      formatMessage({
        id: "page.channel-create.form.error.required.description",
      })
    ),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(createChannelFormSchema) });
  const { authenticatedUser } = useAuth();
  const toast = C.useToast();

  const { mutate, isLoading } = useCreateChannel();

  const onSubmit: SubmitHandler<ChannelPayload> = async ({
    title,
    description,
  }) => {
    mutate(
      {
        payload: { title, description },
        params: { userId: authenticatedUser.id },
      },
      {
        onSuccess: () => {
          toast({
            title: formatMessage(
              { id: "toast.channel.create.success.title" },
              { title }
            ),
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top-right",
          });
          push("/");
        },
      }
    );
  };

  return (
    <Layout
      title={formatMessage({ id: "page.channel-create.title" })}
      description={formatMessage({ id: "page.channel-create.description" })}
    >
      <MotionFlex
        variants={CARDS_ANIMATION}
        transition={TRANSITION}
        initial="unMounted"
        animate="mounted"
        exit="unMounted"
        flexDirection="column"
        as="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Title title={formatMessage({ id: "page.channel-create.title" })} />
        <Input
          name="title"
          type="title"
          error={errors.title}
          label={formatMessage({ id: "page.channel-create.form.label.title" })}
          {...register("title")}
        />
        <Input
          my="24px"
          name="description"
          error={errors.description}
          {...register("description")}
          label={formatMessage({
            id: "page.channel-create.form.label.description",
          })}
        />
        <C.Flex justify={["center", "flex-end"]} my="16px">
          <C.Button
            variant="solid"
            bg="green.400"
            _hover={{
              bg: "green.500",
            }}
            fontSize={["12px", "16px"]}
            h={["auto", "56px"]}
            p="12px"
            width="100%"
            maxW="200px"
            type="submit"
            isLoading={isSubmitting || isLoading}
          >
            {formatMessage({ id: "page.channel-create.form.button.submit" })}
          </C.Button>
        </C.Flex>
      </MotionFlex>
    </Layout>
  );
};

export default CreateChannel;

export const getServerSideProps = withSSRAuth(
  async () => {
    return {
      props: {},
    };
  },
  {
    roles: [ROLES.CREATOR],
  }
);
