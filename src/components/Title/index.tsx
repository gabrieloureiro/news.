import * as C from "@chakra-ui/react";

const Title: React.VFC<{ title: string }> = ({ title }) => {
  return (
    <C.Text
      minW="150px"
      as="h2"
      fontWeight="bold"
      fontSize={["16px", "20px"]}
      color="white"
      lineHeight={["26px", "30px"]}
      mb="24px"
    >
      {title}
    </C.Text>
  );
};

export default Title;
