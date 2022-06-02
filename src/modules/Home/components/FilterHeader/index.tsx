import * as C from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { FiSearch } from "react-icons/fi";
import { useIntl } from "react-intl";
import { Title } from "modules/Home/components";

type FilterHeaderProps = {
  title: string;
  options: Options[];
  currentFilterOption: string;
  setCurrentFilterOption: Dispatch<SetStateAction<string>>;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
};

export const FilterHeader: React.VFC<FilterHeaderProps> = ({
  title,
  options,
  currentFilterOption,
  setCurrentFilterOption,
  inputValue,
  setInputValue,
}) => {
  const { formatMessage } = useIntl();

  return (
    <C.Flex>
      <Title title={title} />
      <C.InputGroup>
        <C.Input
          border="none"
          background="gray.700"
          placeholder={formatMessage({ id: "filter.search.placeholder" })}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <C.InputRightElement children={<FiSearch color="white" />} />
      </C.InputGroup>
      <C.Select
        ml="12px"
        border="none"
        background="gray.700"
        maxWidth={["40px", "118px"]}
        cursor="pointer"
        value={currentFilterOption}
        onChange={(e) => setCurrentFilterOption(e.target.value)}
      >
        {options?.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </C.Select>
    </C.Flex>
  );
};
