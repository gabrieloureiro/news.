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
import { useRouter } from "next/router";
import { useCanAccess } from "utils/auth/use-can-access";
import { ROLES } from "@constants";

const MotionFlex = motion<Omit<C.FlexProps, "transition">>(C.Flex);

const Header: React.VFC = () => {
  const { push } = useRouter();
  const { formatMessage } = useIntl();
  const { currentLocale, handleChangeLocale } = useLanguage();
  const { authenticatedUser, signOut } = useAuth();
  const authenticatedUserIsConsumer = useCanAccess({ roles: [ROLES.CONSUMER] });

  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    handleChangeLocale(event.target.value);
  };

  return (
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
      <Link href="/">
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
                onClick={() => push("/requests/create")}
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
  );
};

export default Header;
