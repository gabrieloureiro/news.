import { AccordionMessage, Layout, Loading, Title } from "components";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useIntl } from "react-intl";
import * as C from "@chakra-ui/react";
import {
  useCreateNews,
  useDeleteMessage,
  useUpdateNewsLikes,
} from "hooks/news";
import { useAuth } from "context";
import { useChannel, useDeleteChannel } from "hooks/channel";
import { motion } from "framer-motion";
import { CARDS_ANIMATION, TRANSITION } from "animations";
import dynamic from "next/dynamic";
import { Message } from "types";
import { withSSRAuth } from "utils/auth/withSSRAuth";
import { ROLES } from "@constants";
import { useCanAccess } from "utils/auth/use-can-access";
import { FiTrash2 } from "react-icons/fi";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const MotionFlex = motion<Omit<C.FlexProps, "transition">>(C.Flex);

const Channel = () => {
  const toast = C.useToast();
  const { onOpen, onClose, isOpen } = C.useDisclosure();
  const initialFocusRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState<Message[]>([] as Message[]);
  const [currentMessage, setCurrentMessage] = useState("");
  const { query, push } = useRouter();
  const { formatMessage } = useIntl();
  const { authenticatedUser } = useAuth();
  const { mutate: mutateCreateNews, isLoading: isLoadingMutateCreateNews } =
    useCreateNews();
  const { mutate: mutateNewsLike } = useUpdateNewsLikes();
  const {
    mutate: mutateDeleteChannel,
    isLoading: isLoadingMutateDeleteChannel,
  } = useDeleteChannel();
  const { mutate: mutateDeleteMessage, isLoading: isLoadingDeleteMessage } =
    useDeleteMessage();

  const authenticatedUserIsAdmin = useCanAccess({ roles: [ROLES.ADMIN] });
  const isDisabled = currentMessage.replace(/(<([^>]+)>)/gi, "").length === 0;

  const channelId = query.id?.toString();
  const userId = authenticatedUser.id?.toString();

  const { data, isLoading, isError, isFetching, isFetched, isSuccess } =
    useChannel({
      id: channelId,
      userId,
    });

  const isLoadingNews = (isLoading || isFetching) && !isFetched;

  const showDeleteChannelButton =
    authenticatedUserIsAdmin || authenticatedUser.id === data?.channel_owner.id;

  const currentUserMessages = data?.messages.filter(
    (message) => message.message_owner.id === authenticatedUser.id
  );

  const handleSubmit = useCallback(() => {
    mutateCreateNews(
      {
        payload: { message: currentMessage },
        params: { userId: authenticatedUser.id, channelId },
      },
      {
        onSuccess: () => {
          toast({
            title: formatMessage({ id: "toast.message.create.success.title" }),
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top-right",
          });
          setCurrentMessage("");
        },
      }
    );
  }, [
    mutateCreateNews,
    currentMessage,
    authenticatedUser,
    channelId,
    formatMessage,
    toast,
  ]);

  const handleDeleteChannel = useCallback(() => {
    mutateDeleteChannel(
      {
        id: channelId,
        params: { userId },
      },
      {
        onSuccess: () => {
          toast({
            title: formatMessage({ id: "toast.channel.delete.success.title" }),
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top-right",
          });
          onClose();
          push("/");
        },
        onError: (e: Error) => {
          toast({
            title: formatMessage({ id: "toast.channel.delete.error.title" }),
            description: e.message,
            status: "error",
            duration: 9000,
            isClosable: true,
            position: "top-right",
          });
        },
      }
    );
  }, [
    toast,
    userId,
    mutateDeleteChannel,
    formatMessage,
    channelId,
    push,
    onClose,
  ]);

  const handleDeleteMessage = useCallback(
    (message: Message) => {
      mutateDeleteMessage(
        {
          id: message.id,
          params: { userId },
        },
        {
          onSuccess: () => {
            toast({
              title: formatMessage({
                id: "toast.message.delete.success.title",
              }),
              status: "success",
              duration: 9000,
              isClosable: true,
              position: "top-right",
            });
          },
          onError: (e: Error) => {
            toast({
              title: formatMessage({
                id: "toast.message.delete.error.title",
              }),
              description: e.message,
              status: "error",
              duration: 9000,
              isClosable: true,
              position: "top-right",
            });
          },
        }
      );
    },
    [mutateDeleteMessage, userId, toast, formatMessage]
  );

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
                title: formatMessage({
                  id: "toast.message.like.success.title",
                }),
                status: "success",
                duration: 9000,
                isClosable: true,
                position: "top-right",
              });
            } else {
              toast({
                title: formatMessage({
                  id: "toast.message.unlike.success.title",
                }),
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
    [toast, formatMessage, mutateNewsLike, authenticatedUser, messages]
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messagesEndRef]);

  useEffect(() => {
    if (isSuccess && data) {
      setMessages(data.messages);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isSuccess && !isOpen) {
      scrollToBottom();
    }
  }, [isSuccess, scrollToBottom, isOpen]);

  const contentNews = useMemo(() => {
    if (isLoadingNews) {
      return <Loading />;
    }

    if (isError) {
      toast({
        title: formatMessage({ id: "toast.news.error.title" }),
        description: formatMessage({ id: "toast.news.error.description" }),
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
          <C.Flex
            align={["flex-start", "center"]}
            flexDirection={["column", "row"]}
            position="relative"
          >
            <Title title={data.title} />
            <C.Text mb="24px" as="span" fontStyle="italic">
              {formatMessage(
                { id: "page.news.channel-owner.name" },
                { name: data.channel_owner.name }
              )}
            </C.Text>
            {showDeleteChannelButton && (
              <C.Popover
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                initialFocusRef={initialFocusRef}
                placement="bottom-start"
                closeOnBlur={false}
              >
                <C.PopoverTrigger>
                  <C.Button
                    position="absolute"
                    right="0"
                    top="0"
                    variant="ghost"
                    fontSize={["12px", "14px"]}
                    isLoading={isLoadingMutateDeleteChannel}
                  >
                    <C.Icon
                      as={FiTrash2}
                      color="red.500"
                      _hover={{
                        color: "red.600",
                      }}
                    />
                  </C.Button>
                </C.PopoverTrigger>
                <C.PopoverContent bg="gray.600" border="0">
                  <C.PopoverHeader borderColor="gray.800" fontWeight="semibold">
                    {formatMessage({ id: "page.news.popover.title" })}
                  </C.PopoverHeader>
                  <C.PopoverArrow bg="gray.600" />
                  <C.PopoverCloseButton color="red.300" />
                  <C.PopoverBody>
                    {formatMessage({ id: "page.news.popover.content" })}
                  </C.PopoverBody>
                  <C.PopoverFooter
                    border="0"
                    display="flex"
                    justifyContent="flex-end"
                  >
                    <C.ButtonGroup size="sm">
                      <C.Button
                        variant="outline"
                        _hover={{
                          color: "red.300",
                          borderColor: "red.300",
                        }}
                        onClick={onClose}
                      >
                        {formatMessage({
                          id: "page.news.popover.button.cancel",
                        })}
                      </C.Button>
                      <C.Button
                        colorScheme="red"
                        isLoading={isLoadingMutateDeleteChannel}
                        onClick={handleDeleteChannel}
                      >
                        {formatMessage({
                          id: "page.news.popover.button.confirm",
                        })}
                      </C.Button>
                    </C.ButtonGroup>
                  </C.PopoverFooter>
                </C.PopoverContent>
              </C.Popover>
            )}
          </C.Flex>
          {messages.map((item) => {
            const showDeleteMessageButton =
              currentUserMessages.includes(item) || authenticatedUserIsAdmin;
            return (
              <AccordionMessage
                key={item.id}
                isLiked={item.isLiked}
                message={item.message}
                messageOwner={item.message_owner.name}
                handleLikeMessage={() => handleLikeMessage(item)}
                handleDeleteMessage={() => handleDeleteMessage(item)}
                showDeleteMessageButton={showDeleteMessageButton}
                isLoadingDeleteMessage={isLoadingDeleteMessage}
              />
            );
          })}
        </>
      )
    );
  }, [
    authenticatedUserIsAdmin,
    isLoadingDeleteMessage,
    messages,
    showDeleteChannelButton,
    toast,
    isOpen,
    onClose,
    onOpen,
    data,
    isLoadingNews,
    isSuccess,
    isError,
    formatMessage,
    handleLikeMessage,
    handleDeleteChannel,
    isLoadingMutateDeleteChannel,
    initialFocusRef,
    handleDeleteMessage,
    currentUserMessages,
  ]);

  return (
    <Layout
      title={isLoading ? formatMessage({ id: "loading" }) : data.title}
      description={
        isLoading ? formatMessage({ id: "loading" }) : data.description
      }
    >
      <MotionFlex
        ref={messagesEndRef}
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

export const getServerSideProps = withSSRAuth(
  async () => {
    return {
      props: {},
    };
  },
  {
    roles: [ROLES.ADMIN, ROLES.CONSUMER, ROLES.CREATOR],
  }
);
