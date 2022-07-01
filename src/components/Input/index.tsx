import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input as ChakraInput,
  InputRightElement,
  InputGroup,
  InputProps as ChakraInputProps,
} from "@chakra-ui/react";
import { RiErrorWarningFill } from "react-icons/ri";
import { FieldError } from "react-hook-form";
import React, { useState, forwardRef, ForwardRefRenderFunction } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export interface InputProps extends Omit<ChakraInputProps, "variant" | "size"> {
  name: string;
  label?: string;
  error?: Omit<FieldError, "type">;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  {
    onChange,
    name,
    placeholder,
    defaultValue,
    maxLength,
    value,
    label,
    error = null,
    type,
    ...rest
  },
  ref
) => {
  const [show, setShow] = useState(false);
  const isPassword =
    name === "password" ||
    name === "password_confirmation" ||
    name === "new_password";
  const showPassword = isPassword && show;

  function handleInputType() {
    if (!type) {
      if (!isPassword) {
        return "text";
      } else if (showPassword) {
        return "text";
      } else {
        return "password";
      }
    }
    return type;
  }

  return (
    <FormControl flexDirection="column" isInvalid={!!error} {...rest}>
      {!!label && (
        <FormLabel fontSize="16px" color="white.400" htmlFor={name}>
          {label}
        </FormLabel>
      )}
      <InputGroup>
        <ChakraInput
          value={value}
          id={name}
          name={name}
          ref={ref}
          onChange={onChange}
          defaultValue={defaultValue}
          placeholder={placeholder}
          maxLength={maxLength}
          type={handleInputType()}
          w="100%"
          h={["42px", "56px"]}
          lineHeight="150%"
          letterSpacing="0.007em"
          color="gray.900"
          bg="white"
          borderColor="white"
          borderRadius="10px"
          border="1px solid"
          errorBorderColor="error"
          focusBorderColor="white.400"
          _focus={{
            borderColor: "white.400",
            boxShadow:
              "3px 3px 10px rgba(1, 157, 216, 0.25), -3px -3px 10px rgba(1, 157, 216, 0.25);",
          }}
        />
        {!!error && (
          <InputRightElement
            height="100%"
            children={<RiErrorWarningFill />}
            color="error"
          />
        )}
        {isPassword && (
          <InputRightElement
            height="100%"
            cursor="pointer"
            children={show ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            onClick={() => setShow(!show)}
            fontSize="24px"
            color="#DADADA"
            mr="24px"
          />
        )}
      </InputGroup>
      {!!error && (
        <FormErrorMessage color="red.500" mt="8px" fontSize="14px">
          {error.message}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export const Input = forwardRef(InputBase);
