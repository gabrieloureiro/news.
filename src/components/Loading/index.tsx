import * as C from "@chakra-ui/react";

const Loading: React.VFC = () => {
  return (
    <C.Center w="100%">
      <C.Spinner size="xl" />
    </C.Center>
  );
};

export default Loading;
