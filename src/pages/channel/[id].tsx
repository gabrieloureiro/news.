import { AccordionMessage, Layout, Loading, Title } from "components";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import * as C from "@chakra-ui/react";
import { useCreateNews, useUpdateNewsLikes } from "hooks/news";
import { useAuth } from "context";
import { useChannel } from "hooks/channel";
import { motion } from "framer-motion";
import { CARDS_ANIMATION, TRANSITION } from "animations";
import dynamic from "next/dynamic";
import { Message } from "types";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const MotionFlex = motion<Omit<C.FlexProps, "transition">>(C.Flex);

const Channel = () => {
  const [currentMessage, setCurrentMessage] = useState("");
  const toast = C.useToast();
  const { query } = useRouter();
  const { formatMessage } = useIntl();
  const { authenticatedUser } = useAuth();
  const { mutate: mutateCreateNews, isLoading: isLoadingMutateCreateNews } =
    useCreateNews();
  const { mutate: mutateNewsLike } = useUpdateNewsLikes();
  const isDisabled = currentMessage.replace(/(<([^>]+)>)/gi, "").length === 0;
  const channelId = query.id?.toString();
  const [messages, setMessages] = useState<Message[]>([] as Message[]);

  const { data, isLoading, isError, isFetching, isFetched, isSuccess } =
    useChannel({
      id: channelId,
      userId: authenticatedUser.id,
    });

  const isLoadingNews = (isLoading || isFetching) && !isFetched;

  const handleSubmit = () => {
    mutateCreateNews({
      payload: { message: currentMessage },
      params: { userId: authenticatedUser.id, channelId },
    });
  };

  const handleLikeMessage = useCallback(
    (message: Message) => {
      const currentMessage = messages.find((m) => m.id === message.id);

      const changedMessage = {
        ...currentMessage,
        isLiked: !currentMessage.isLiked,
      };

      const newMessages = messages.map((x) => {
        const item = [changedMessage].find((a) => a.id === x.id);
        return item || x;
      });

      setMessages(newMessages);

      mutateNewsLike(
        {
          payload: { id: message.id },
          params: { userId: authenticatedUser.id },
        },
        {
          onSuccess: () => {
            if (!currentMessage.isLiked) {
              toast({
                title: "Mensagem curtida!",
                status: "success",
                duration: 9000,
                isClosable: true,
                position: "top-right",
              });
            } else {
              toast({
                title: "Mensagem descurtida!",
                status: "warning",
                duration: 9000,
                isClosable: true,
                position: "top-right",
              });
            }
          },
        }
      );
    },
    [mutateNewsLike, authenticatedUser, messages]
  );

  useEffect(() => {
    if (isSuccess && data) {
      setMessages(data.messages);
    }
  }, [isSuccess, data]);

  const contentNews = useMemo(() => {
    if (isLoadingNews) {
      return <Loading />;
    }

    if (isError) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar os dados do canal ",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    return (
      isSuccess &&
      data && (
        <>
          <Title title={data.title} />
          {messages.map((item) => {
            return (
              <AccordionMessage
                key={item.id}
                isLiked={item.isLiked}
                message={item.message}
                handleLikeMessage={() => handleLikeMessage(item)}
              />
            );
          })}
        </>
      )
    );
  }, [
    data,
    isLoadingNews,
    isSuccess,
    isFetching,
    isError,
    mutateCreateNews,
    channelId,
    authenticatedUser,
    formatMessage,
    handleLikeMessage,
  ]);

  return (
    <Layout
      title={isLoading ? formatMessage({ id: "loading" }) : data.title}
      description={
        isLoading ? formatMessage({ id: "loading" }) : data.description
      }
    >
      <MotionFlex
        variants={CARDS_ANIMATION}
        transition={TRANSITION}
        initial="unMounted"
        animate="mounted"
        exit="unMounted"
        mb="32px"
        justify="center"
        flexDirection="column"
      >
        {contentNews}
        <ReactQuill
          style={{
            backgroundColor: "white",
            marginTop: "32px",
            color: "black",
          }}
          theme="snow"
          placeholder="Digite aqui sua mensagem..."
          value={currentMessage}
          onChange={setCurrentMessage}
        />
        <C.Button
          ml="auto"
          mt="32px"
          variant="solid"
          bg="yellow.400"
          _hover={{
            bg: "yellow.500",
          }}
          fontSize={["12px", "16px"]}
          h={["auto", "56px"]}
          p="12px"
          type="submit"
          isLoading={isLoadingMutateCreateNews}
          disabled={isDisabled}
          onClick={handleSubmit}
        >
          {formatMessage({ id: "page.news.form.button.submit" })}
        </C.Button>
      </MotionFlex>
    </Layout>
  );
};

export default Channel;