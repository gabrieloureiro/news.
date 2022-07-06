import * as C from "@chakra-ui/react";
import { useRef } from "react";
import { AiFillStar } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";
import { useIntl } from "react-intl";

type AccordionMessageProps = {
  message: string;
  handleLikeMessage: () => void;
  isLiked: boolean;
  messageOwner: string;
  handleDeleteMessage: () => void;
  showDeleteMessageButton: boolean;
  isLoadingDeleteMessage: boolean;
};

const AccordionMessage: React.FC<AccordionMessageProps> = ({
  message,
  handleLikeMessage,
  isLiked,
  messageOwner,
  handleDeleteMessage,
  showDeleteMessageButton,
  isLoadingDeleteMessage,
}) => {
  const initialFocusRef = useRef(null);

  const { formatMessage } = useIntl();
  const { onOpen, onClose, isOpen } = C.useDisclosure();

  const LikesRow = () => {
    return (
      <C.Flex justifyContent="space-between" align="flex-end" pt="16px">
        <C.Text as="span" fontStyle="italic">
          {formatMessage(
            { id: "page.news.channel-owner.name" },
            { name: messageOwner }
          )}
        </C.Text>
        <C.Flex>
          <C.Button variant="ghost" mr="8px" onClick={handleLikeMessage}>
            <C.Icon
              as={AiFillStar}
              w="24px"
              h="24px"
              color={isLiked ? "yellow.400" : "white.400"}
            />
          </C.Button>
          {showDeleteMessageButton && (
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
                  right="0"
                  top="0"
                  variant="ghost"
                  fontSize={["12px", "14px"]}
                  isLoading={isLoadingDeleteMessage}
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
                  {formatMessage({ id: "page.news.popover.content-message" })}
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
                      isLoading={isLoadingDeleteMessage}
                      onClick={() => {
                        handleDeleteMessage();
                        onClose();
                      }}
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
