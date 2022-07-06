import { skeletonColors } from "styles/skeleton-colors";
import * as C from "@chakra-ui/react";
import { useMediaQuery } from "utils/hooks";

const SkeletonCard: React.VFC<C.BoxProps> = ({
  maxW = "350px",
  h = "240px",
  ...rest
}) => {
  const { isDesktop } = useMediaQuery();
  return (
    <C.Skeleton
      w="100%"
      maxW={isDesktop ? maxW : "auto"}
      h={h}
      borderRadius="8px"
      {...rest}
      {...skeletonColors}
    />
  );
};

export default SkeletonCard;
