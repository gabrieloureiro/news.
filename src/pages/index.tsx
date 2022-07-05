import { Layout, Loading } from "components";
import { useIntl } from "react-intl";
import * as C from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CARDS_ANIMATION, TRANSITION } from "animations";
import { ChannelCard, FilterHeader, Title } from "components";
import { withSSRAuth } from "utils/auth/withSSRAuth";
import { ROLES } from "@constants";
import { useChannels } from "hooks/channel";
import { useRouter } from "next/router";
import { useAuth } from "context";

const MotionFlex = motion<Omit<C.FlexProps, "transition">>(C.Flex);

const Home: React.VFC = () => {
  const { push } = useRouter();
  const toast = C.useToast();
  const { formatMessage } = useIntl();
  const [currentFilterOption, setCurrentFilterOption] = useState("all");
  const [inputValue, setInputValue] = useState("");
  const { authenticatedUser } = useAuth();
  const { data, isLoading, isError } = useChannels();

  const filterOptions = [
    {
      label: formatMessage({ id: "page.home.filter.option.all" }),
      value: "all",
    },
    {
      label: formatMessage({ id: "page.home.filter.option.subbed" }),
      value: "subbed",
    },
    {
      label: formatMessage({ id: "page.home.filter.option.most-commented" }),
      value: "most-commented",
    },
    {
      label: formatMessage({ id: "page.home.filter.option.less-commented" }),
      value: "less-commented",
    },
  ];

  const channelsContent = useMemo(() => {
    if (isLoading) {
      return <Loading />;
    }

    if (isError) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar os dados",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    return (
      <>
        {data.map((channel) => {
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
  }, [data, isLoading, isError, formatMessage]);

  const topRankingContent = useMemo(() => {
    const topRankingData = data
      ? data.map((item) => item).sort((a, b) => b.likesAmount - a.likesAmount)
      : [];

    if (isLoading) {
      return <Loading />;
    }

    if (isError || !topRankingData.length) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar os dados",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
      return;
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
  }, [data, isLoading, isError, formatMessage]);

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
            inputValue={inputValue}
            setInputValue={setInputValue}
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
