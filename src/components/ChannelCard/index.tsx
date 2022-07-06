import * as C from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BiCommentDetail } from "react-icons/bi";
import { AiFillStar } from "react-icons/ai";

type ChannelCardProps = {
  id: string;
  title: string;
  description: string;
  messagesAmount?: number;
  likesAmount?: number;
  isRankingCard?: boolean;
};

const ChannelCard: React.FC<ChannelCardProps> = ({
  id,
  title,
  description,
  messagesAmount,
  likesAmount,
  isRankingCard = false,
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
      maxH="120px"
      mb="24px"
      transition="0.2s ease-in-out"
      _hover={{
        bg: "gray.600",
      }}
      position="relative"
    >
      <C.Flex position="absolute" right={isRankingCard ? "80px" : "16px"}>
        <C.Text
          mr="8px"
          as="span"
          fontSize={["12px", "16px"]}
          lineHeight={["20px", "24px"]}
        >
          {messagesAmount}
        </C.Text>
        <C.Icon as={BiCommentDetail} w="24px" h="24px" />
      </C.Flex>

      {isRankingCard && (
        <C.Flex position="absolute" right="16px">
          <C.Text
            mr="8px"
            as="span"
            fontSize={["12px", "16px"]}
            lineHeight={["20px", "24px"]}
            color="yellow.400"
            fontWeight="600"
          >
            {likesAmount}
          </C.Text>
          <C.Icon as={AiFillStar} w="24px" h="24px" color="yellow.400" />
        </C.Flex>
      )}

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

export default ChannelCard;
