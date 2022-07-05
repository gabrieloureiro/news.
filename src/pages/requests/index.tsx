import { ROLES } from "@constants";
import { Layout } from "components";
import { withSSRAuth } from "utils/auth/withSSRAuth";
import * as C from "@chakra-ui/react";
import { useIntl } from "react-intl";
import { motion } from "framer-motion";
import { CARDS_ANIMATION, TRANSITION } from "animations";

const MotionFlex = motion<Omit<C.FlexProps, "transition">>(C.Flex);

const Requests = () => {
  const { formatMessage } = useIntl();

  return (
    <Layout
      title={formatMessage({ id: "page.channel-create.title" })}
      description={formatMessage({ id: "page.channel-create.description" })}
    >
      <MotionFlex
        variants={CARDS_ANIMATION}
        transition={TRANSITION}
        initial="unMounted"
        animate="mounted"
        exit="unMounted"
        flexDirection="column"
        as="form"
      >
        aaa
      </MotionFlex>
    </Layout>
  );
};

export default Requests;

export const getServerSideProps = withSSRAuth(
  async () => {
    return {
      props: {},
    };
  },
  {
    roles: [ROLES.ADMIN],
  }
);
