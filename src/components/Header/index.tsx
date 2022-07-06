import * as C from "@chakra-ui/react";
import { BsGlobe } from "react-icons/bs";
import { CARDS_ANIMATION, TRANSITION } from "animations";
import { useAuth, useLanguage } from "context";
import { motion } from "framer-motion";
import { useIntl } from "react-intl";
import { LOCALE } from "locales";
import { MdExitToApp, MdNotificationImportant } from "react-icons/md";
import { ChangeEvent } from "react";
import Link from "next/link";
import { useCanAccess } from "utils/auth/use-can-access";
import { ROLES } from "@constants";
import { useCreateRequisition } from "hooks/requisitions";

const MotionFlex = motion<Omit<C.FlexProps, "transition">>(C.Flex);

const Header: React.VFC = () => {
  const { formatMessage } = useIntl();
  const toast = C.useToast();
  const { isOpen, onOpen, onClose } = C.useDisclosure();
  const { currentLocale, handleChangeLocale } = useLanguage();
  const { authenticatedUser, signOut } = useAuth();
  const authenticatedUserIsConsumer = useCanAccess({ roles: [ROLES.CONSUMER] });
  const { mutate, isLoading } = useCreateRequisition();

  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    handleChangeLocale(event.target.value);
  };

  const handleCreateRequest = () => {
    mutate(authenticatedUser.id, {
      onSuccess: () => {
        toast({
          title: formatMessage({ id: "toast.request.create.success.title" }),
          description: formatMessage({
            id: "toast.request.create.success.description",
          }),
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top-right",
        });
      },
      onError: () => {
        toast({
          title: formatMessage({ id: "toast.request.create.error.title" }),
          description: formatMessage({
            id: "toast.request.create.error.description",
          }),
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top-right",
        });
        onClose();
      },
    });
  };

  return (
    <>
      <MotionFlex
        w="100%"
        h="56px"
        bg="gray.700"
        borderRadius="6px"
        p="12px 24px"
        align="center"
        justify="space-between"
        mb="32px"
        variants={CARDS_ANIMATION}
        transition={TRANSITION}
        initial="unMounted"
        animate="mounted"
        exit="unMounted"
      >
        <Link passHref href="/">
          <C.Text
            cursor="pointer"
            as="h1"
            fontSize={["1xl", "3xl"]}
            fontWeight="bold"
            letterSpacing="tight"
          >
            {formatMessage({ id: "page.home.title" })}
            <C.Text as="span" ml="2px" color="yellow.400">
              .
            </C.Text>
          </C.Text>
        </Link>
        <C.Flex>
          <C.Select
            color="white"
            icon={<BsGlobe color="white" />}
            maxWidth={["40px", "190px"]}
            w="190px"
            cursor="pointer"
            value={currentLocale}
            onChange={(event) => onChange(event)}
          >
            <option value={LOCALE.PT_BR}>
              {formatMessage({ id: "header.select.option.portuguese" })}
            </option>
            <option value={LOCALE.EN_US}>
              {formatMessage({ id: "header.select.option.english" })}
            </option>
          </C.Select>
          <C.Menu>
            <C.MenuButton zIndex="999">
              <C.Avatar
                cursor="pointer"
                w="32px"
                h="32px"
                ml="16px"
                name={authenticatedUser.name}
              />
            </C.MenuButton>
            <C.MenuList>
              {authenticatedUserIsConsumer && (
                <C.MenuItem
                  color="gray.600"
                  icon={<MdNotificationImportant size="16px" />}
                  onClick={onOpen}
                >
                  {formatMessage({ id: "header.menu.item.create-request" })}
                </C.MenuItem>
              )}

              <C.MenuItem
                color="gray.600"
                icon={<MdExitToApp size="16px" />}
                onClick={signOut}
              >
                {formatMessage({ id: "header.menu.item.logout" })}
              </C.MenuItem>
            </C.MenuList>
          </C.Menu>
        </C.Flex>
      </MotionFlex>

      <C.Modal isOpen={isOpen} onClose={onClose}>
        <C.ModalOverlay />
        <C.ModalContent bg="gray.600">
          <C.ModalHeader>
            {formatMessage({ id: "modal.request.title" })}
          </C.ModalHeader>
          <C.ModalCloseButton />
          <C.ModalBody>
            {formatMessage({ id: "modal.request.content" })}
          </C.ModalBody>
          <C.ModalFooter>
            <C.Button
              variant="solid"
              bg="green.400"
              _hover={{
                bg: "green.500",
              }}
              fontSize={["12px", "16px"]}
              p="12px"
              type="submit"
              isLoading={isLoading}
              onClick={handleCreateRequest}
            >
              {formatMessage({ id: "modal.request.button.submit" })}
            </C.Button>
          </C.ModalFooter>
        </C.ModalContent>
      </C.Modal>
    </>
  );
};

export default Header;
