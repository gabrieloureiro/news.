import { ROLES } from "@constants";
import { Layout, Loading, RequisitionsCard, Title } from "components";
import { withSSRAuth } from "utils/auth/withSSRAuth";
import * as C from "@chakra-ui/react";
import { useIntl } from "react-intl";
import { motion } from "framer-motion";
import { CARDS_ANIMATION, TRANSITION } from "animations";
import { useRequisitions } from "hooks/requisitions";
import { useMemo } from "react";

const MotionFlex = motion<Omit<C.FlexProps, "transition">>(C.Flex);

const Requests = () => {
  const { formatMessage } = useIntl();
  const toast = C.useToast();
  const { data, isLoading, isError, isFetched, isFetching, isSuccess } =
    useRequisitions();

  const isLoadingRequisitions = (isLoading || isFetching) && !isFetched;

  const contentRequisitions = useMemo(() => {
    if (isLoadingRequisitions) {
      return <Loading />;
    }

    if (isError) {
      toast({
        title: formatMessage({ id: "toast.request.error.title" }),
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    if (isSuccess && data) {
      return (
        <>
          {data.map((requisition) => {
            return (
              <RequisitionsCard
                key={requisition.id}
                id={requisition.id}
                username={requisition.name}
                status={requisition.status}
              />
            );
          })}
        </>
      );
    }
  }, [toast, isLoadingRequisitions, isError, isSuccess, data, formatMessage]);

  return (
    <Layout
      title={formatMessage({ id: "page.requisitions.title" })}
      description={formatMessage({ id: "page.requisitions.description" })}
    >
      <MotionFlex
        variants={CARDS_ANIMATION}
        transition={TRANSITION}
        initial="unMounted"
        animate="mounted"
        exit="unMounted"
        flexDirection="column"
      >
        <Title title={formatMessage({ id: "page.requisitions.heading" })} />
        {contentRequisitions}
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
