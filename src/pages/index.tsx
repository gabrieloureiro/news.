import { Layout, Loading } from "components";
import { useIntl } from "react-intl";
import * as C from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CARDS_ANIMATION, TRANSITION } from "animations";
import { ChannelCard, FilterHeader, Title } from "components";
import { withSSRAuth } from "utils/auth/withSSRAuth";
import { ROLES } from "@constants";
import { useChannels } from "hooks/channel";
import { useRouter } from "next/router";
import { useAuth } from "context";
import { useCanAccess } from "utils/auth/use-can-access";

const MotionFlex = motion<Omit<C.FlexProps, "transition">>(C.Flex);

const Home: React.VFC = () => {
  const { push } = useRouter();
  const toast = C.useToast();
  const { formatMessage } = useIntl();
  const [currentFilterOption, setCurrentFilterOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { authenticatedUser } = useAuth();
  const { data, isLoading, isError, isSuccess } = useChannels();

  const authenticatedUserIsAdmin = useCanAccess({ roles: [ROLES.ADMIN] });
  const authenticatedUserIsCreator = useCanAccess({ roles: [ROLES.CREATOR] });

  const filterOptions = useMemo(
    () => [
      {
        label: formatMessage({ id: "page.home.filter.option.all" }),
        value: "",
      },
      {
        label: formatMessage({ id: "page.home.filter.option.most-commented" }),
        value: "most-commented",
      },
      {
        label: formatMessage({ id: "page.home.filter.option.less-commented" }),
        value: "less-commented",
      },
    ],
    [formatMessage]
  );

  const sortOptions = useCallback(
    (a, b) => {
      if (currentFilterOption === filterOptions[1].value) {
        return b.messagesAmount - a.messagesAmount;
      } else if (currentFilterOption === filterOptions[2].value) {
        return a.messagesAmount - b.messagesAmount;
      } else {
        return;
      }
    },
    [currentFilterOption, filterOptions]
  );

  const channelsContent = useMemo(() => {
    const filteredChannels = data
      ?.filter((channel) => {
        if (searchTerm === "") {
          return channel;
        } else if (
          channel.title.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return channel;
        }
      })
      .map((channel) => channel)
      .sort(sortOptions);

    if (isLoading) {
      return <Loading />;
    }

    if (isError) {
      toast({
        title: formatMessage({ id: "toast.channels.error.title" }),
        description: formatMessage({ id: "toast.channels.error.description" }),
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    return (
      <>
        {isSuccess &&
          filteredChannels.map((channel) => {
            return (
              <ChannelCard
                key={channel.id}
                id={channel.id}
                messagesAmount={channel.messagesAmount}
                title={channel.title}
                description={channel.description}
              />
            );
          })}
      </>
    );
  }, [
    sortOptions,
    searchTerm,
    data,
    isLoading,
    isError,
    formatMessage,
    isSuccess,
    toast,
  ]);

  const topRankingContent = useMemo(() => {
    const topRankingData = data
      ?.map((item) => item)
      .sort((a, b) => b.likesAmount - a.likesAmount);

    if (isLoading) {
      return <Loading />;
    }

    return (
      <>
        {topRankingData.map((channel) => {
          return (
            <ChannelCard
              isRankingCard
              messagesAmount={channel.messagesAmount}
              likesAmount={channel.likesAmount}
              key={channel.id}
              id={channel.id}
              title={channel.title}
              description={channel.description}
            />
          );
        })}
      </>
    );
  }, [data, isLoading]);

  return (
    <Layout
      title={formatMessage({ id: "page.home.title" })}
      description={formatMessage({ id: "page.home.description" })}
    >
      <MotionFlex
        variants={CARDS_ANIMATION}
        transition={TRANSITION}
        initial="unMounted"
        animate="mounted"
        exit="unMounted"
        mb="32px"
        justify={["center", "space-between"]}
        flexDirection={["column", "row"]}
      >
        <C.Text as="h1" mb="32px" fontSize={["18px", "24px"]} fontWeight="bold">
          {formatMessage(
            { id: "page.home.welcome" },
            { name: authenticatedUser.name }
          )}
        </C.Text>
        <C.Flex flexDirection={["column", "row"]}>
          {authenticatedUserIsCreator && (
            <C.Button
              mr={["0", "12px"]}
              mb={["12px", "0"]}
              fontSize={["12px", "14px"]}
              background="green.500"
              _hover={{
                background: "green.600",
              }}
              onClick={() => push("/channel/create")}
            >
              {formatMessage({ id: "page.home.button.add-channel" })}
            </C.Button>
          )}
          {authenticatedUserIsAdmin && (
            <C.Button
              fontSize={["12px", "14px"]}
              background="yellow.500"
              _hover={{
                background: "yellow.600",
              }}
              onClick={() => push("/requests")}
            >
              {formatMessage({ id: "page.home.button.manage-users" })}
            </C.Button>
          )}
        </C.Flex>
      </MotionFlex>
      <C.Flex
        sx={{
          "@media (max-width: 1160px)": {
            flexDirection: "column",
          },
        }}
      >
        <MotionFlex
          variants={CARDS_ANIMATION}
          transition={TRANSITION}
          initial="unMounted"
          animate="mounted"
          exit="unMounted"
          flexDirection="column"
          sx={{
            "@media (max-width: 1160px)": {
              w: "100%",
              mr: 0,
            },
          }}
          w="60%"
          mr="24px"
        >
          <FilterHeader
            title={formatMessage({ id: "page.home.filter.title" })}
            options={filterOptions}
            currentFilterOption={currentFilterOption}
            setCurrentFilterOption={setCurrentFilterOption}
            inputValue={searchTerm}
            setInputValue={setSearchTerm}
          />
          {channelsContent}
        </MotionFlex>
        <MotionFlex
          variants={CARDS_ANIMATION}
          transition={TRANSITION}
          initial="unMounted"
          animate="mounted"
          exit="unMounted"
          flexDirection="column"
          sx={{
            "@media (max-width: 1160px)": {
              w: "100%",
            },
          }}
          w="40%"
        >
          <Title title="Top ranking" />
          {topRankingContent}
        </MotionFlex>
      </C.Flex>
    </Layout>
  );
};

export default Home;

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
