import { Layout } from "components";
import { useIntl } from "react-intl";
import * as C from "@chakra-ui/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { CONTAINER_ANIMATION } from "animations";
import { ChannelCard, FilterHeader, Title } from "components";

const MotionFlex = motion<Omit<C.FlexProps, "transition">>(C.Flex);

const Home: React.VFC = () => {
  const { formatMessage } = useIntl();
  const [currentFilterOption, setCurrentFilterOption] = useState("all");
  const [inputValue, setInputValue] = useState("");

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

  const filterParams = {
    searchTerm: inputValue,
    option: currentFilterOption,
  };

  return (
    <Layout
      title={formatMessage({ id: "page.home.title" })}
      description={formatMessage({ id: "page.home.description" })}
    >
      <C.Flex
        mb="32px"
        justify={["center", "flex-end"]}
        flexDirection={["column", "row"]}
      >
        <C.Button
          mr={["0", "12px"]}
          mb={["12px", "0"]}
          fontSize={["12px", "14px"]}
          background="green.500"
          _hover={{
            background: "green.600",
          }}
        >
          {formatMessage({ id: "page.home.button.add-channel" })}
        </C.Button>
        <C.Button
          fontSize={["12px", "14px"]}
          background="yellow.500"
          _hover={{
            background: "yellow.600",
          }}
        >
          {formatMessage({ id: "page.home.button.manage-users" })}
        </C.Button>
      </C.Flex>
      <MotionFlex
        variants={CONTAINER_ANIMATION}
        sx={{
          "@media (max-width: 1160px)": {
            flexDirection: "column",
          },
        }}
      >
        <C.Flex
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
          {[...Array(10)].map((item, index) => {
            return (
              <ChannelCard
                key={index}
                id="1"
                title="Titulo teste"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eleifend ornare interdum. Etiam dapibus vitae diam at lacin... Lorem ipsum dolor sit amet "
              />
            );
          })}
        </C.Flex>
        <C.Flex
          flexDirection="column"
          sx={{
            "@media (max-width: 1160px)": {
              w: "100%",
            },
          }}
          w="40%"
        >
          <Title title="Top ranking" />
          {[...Array(10)].map((item, index) => {
            return (
              <ChannelCard
                isRankingCard
                rating={66}
                key={index}
                id="1"
                title="Titulo teste"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eleifend ornare interdum. Etiam dapibus vitae diam at lacin... Lorem ipsum dolor sit amet "
              />
            );
          })}
        </C.Flex>
      </MotionFlex>
    </Layout>
  );
};

export default Home;
