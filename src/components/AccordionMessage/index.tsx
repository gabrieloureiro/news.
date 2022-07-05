import * as C from "@chakra-ui/react";
import { AiFillStar } from "react-icons/ai";
import { useIntl } from "react-intl";

type AccordionMessageProps = {
  message: string;
  handleLikeMessage: () => void;
  isLiked: boolean;
  messageOwner: string;
};

const AccordionMessage: React.FC<AccordionMessageProps> = ({
  message,
  handleLikeMessage,
  isLiked,
  messageOwner,
}) => {
  const { formatMessage } = useIntl();
  const LikesRow = () => {
    return (
      <C.Flex justifyContent="space-between" align="flex-end" pt="16px">
        <C.Text as="span" fontStyle="italic">
          {formatMessage(
            { id: "page.news.channel-owner.name" },
            { name: messageOwner }
          )}
        </C.Text>
        <C.Button variant="ghost" onClick={handleLikeMessage}>
          <C.Icon
            as={AiFillStar}
            w="24px"
            h="24px"
            color={isLiked ? "yellow.400" : "white.400"}
          />
        </C.Button>
      </C.Flex>
    );
  };

  return (
    <C.Accordion allowMultiple>
      <C.AccordionItem
        flexDirection="column"
        border="0"
        flex="1"
        as="li"
        listStyleType="none"
        bg="gray.700"
        borderRadius="6px"
        p="16px"
        minH="120px"
        mb="24px"
      >
        {({ isExpanded }) =>
          isExpanded ? (
            <>
              <C.AccordionButton>
                <C.AccordionPanel
                  minW="100%"
                  fontSize={["12px", "16px"]}
                  textAlign="left"
                  dangerouslySetInnerHTML={{ __html: message }}
                />
                <C.AccordionIcon ml="auto" mr="16px" />
              </C.AccordionButton>
              <LikesRow />
            </>
          ) : (
            <>
              <C.AccordionButton>
                <C.Text
                  as="span"
                  minW="100%"
                  textAlign="left"
                  fontSize={["12px", "16px"]}
                  color="white"
                  lineHeight={["20px", "24px"]}
                  dangerouslySetInnerHTML={{
                    __html: `${message
                      .substring(0, 380)
                      .replace(/(<([^>]+)>)/gi, "")}...`,
                  }}
                />
                <C.AccordionIcon ml="auto" mr="16px" />
              </C.AccordionButton>
              <LikesRow />
            </>
          )
        }
      </C.AccordionItem>
    </C.Accordion>
  );
};

export default AccordionMessage;
