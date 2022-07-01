import * as S from "./styles";
import * as C from "@chakra-ui/react";

import { useMediaQuery } from "utils/hooks";
import { CARDS_ANIMATION, TRANSITION } from "animations";

import { Transition, Variants } from "framer-motion";

type CardProps = {
  highlightColor: string;
  variants?: Variants;
  transition?: Transition;
} & Omit<
  C.BoxProps,
  "transition" | "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"
>;

const Card: React.FC<CardProps> = ({
  children,
  maxW = "350px",
  h = "240px",
  highlightColor,
  variants = CARDS_ANIMATION,
  transition = TRANSITION,
  ...rest
}) => {
  const { isDesktop } = useMediaQuery();
  return (
    <S.Card
      w="100%"
      maxW={isDesktop ? maxW : "auto"}
      h={h}
      p={["24px 12px", "24px"]}
      borderRadius="8px 8px 0 0"
      bg="gray.700"
      border="2px solid"
      borderColor="transparent"
      borderBottomColor={highlightColor}
      _hover={{
        borderColor: highlightColor,
      }}
      variants={variants}
      transition={transition}
      initial="unMounted"
      animate="mounted"
      exit="unMounted"
      {...rest}
    >
      {children}
    </S.Card>
  );
};

export default Card;
