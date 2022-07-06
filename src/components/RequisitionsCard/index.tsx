import * as C from "@chakra-ui/react";
import { useUpdateRequisition } from "hooks/requisitions";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { useIntl } from "react-intl";

type RequisitionsCardProps = {
  id: number;
  username: string;
  status: string;
};

const STATUS_COLOR = {
  PENDING: "yellow.500",
  APPROVED: "green.500",
  REFUSED: "red.500",
};

const RequisitionsCard: React.VFC<RequisitionsCardProps> = ({
  id,
  username,
  status,
}: RequisitionsCardProps) => {
  const isDisabled = status === "REFUSED" || status === "APPROVED";
  const toast = C.useToast();
  const { formatMessage } = useIntl();
  const { mutate, isLoading: isLoadingMutate } = useUpdateRequisition();

  const STATUS = {
    ["APPROVED"]: formatMessage({ id: "status.approved" }),
    ["PENDING"]: formatMessage({ id: "status.pending" }),
    ["REFUSED"]: formatMessage({ id: "status.refused" }),
  };

  const handleChangeStatus = (status: string) => {
    mutate(
      { id, status },
      {
        onSuccess: () => {
          toast({
            title: formatMessage({ id: "toast.request.update.success.title" }),
            description: formatMessage(
              { id: "toast.request.update.success.description" },
              { username, status: STATUS[status].toLowerCase() }
            ),
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top-right",
          });
        },
      }
    );
  };

  return (
    <C.Flex
      justify="space-between"
      align="center"
      flex="1"
      as="li"
      listStyleType="none"
      bg="gray.700"
      borderRadius="6px"
      p="16px"
      h="120px"
      mb="24px"
    >
      <C.Text fontSize={["14px", "18px"]} fontWeight="500">
        {username}
      </C.Text>
      <C.HStack flexDirection={["column", "row"]} spacing={["0", "12px"]}>
        <C.Badge
          bg={STATUS_COLOR[status]}
          borderRadius="6px"
          p="4px 8px"
          color="white.700"
          fontSize={["10px", "12px"]}
          fontWeight="500"
        >
          {STATUS[status]}
        </C.Badge>
        <C.Button
          variant="ghost"
          isLoading={isLoadingMutate}
          isDisabled={isDisabled}
          onClick={() => handleChangeStatus("APPROVED")}
        >
          <C.Icon
            as={AiOutlineCheck}
            w={["16px", "24px"]}
            h={["16px", "24px"]}
            color="green.500"
          />
        </C.Button>
        <C.Button
          variant="ghost"
          isLoading={isLoadingMutate}
          isDisabled={isDisabled}
          onClick={() => handleChangeStatus("REFUSED")}
        >
          <C.Icon
            as={AiOutlineClose}
            w={["16px", "24px"]}
            h={["16px", "24px"]}
            color="red.500"
          />
        </C.Button>
      </C.HStack>
    </C.Flex>
  );
};

export default RequisitionsCard;
