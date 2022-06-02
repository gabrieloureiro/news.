import * as C from "@chakra-ui/react";
import { useRouter } from "next/router";

type ChannelCardProps = {
  id: string;
  title: string;
  description: string;
  messagesAmount?: number;
};

export const ChannelCard: React.FC<ChannelCardProps> = ({
  id,
  title,
  description,
  messagesAmount = 0,
}) => {
  const { push } = useRouter();

  return (
    <C.Flex
      onClick={() => push(`/channel/${id}`)}
      cursor="pointer"
      flexDirection="column"
      flex="1"
      as="li"
      listStyleType="none"
      bg="gray.700"
      borderRadius="6px"
      p="16px"
      h="120px"
      mb="24px"
      transition="0.2s ease-in-out"
      _hover={{
        bg: "gray.600",
      }}
    >
      <C.Text
        as="h3"
        fontWeight="600"
        fontSize={["14px", "18px"]}
        color="white"
        lineHeight={["24px", "28px"]}
      >
        {title}
      </C.Text>
      <C.Text
        as="span"
        fontSize={["12px", "16px"]}
        color="white"
        lineHeight={["20px", "24px"]}
        mt="auto"
      >
        {description}
      </C.Text>
    </C.Flex>
  );
};
