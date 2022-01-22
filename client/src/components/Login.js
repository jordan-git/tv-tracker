import { Button, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputRightElement, List, ListItem, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from 'react-router-dom';
import * as yup from "yup";
import { fetchApi } from '../utils';


const schema = yup.object().shape({
  email: yup.string()
    .email("Invalid email")
    .required("Email is required"),
  password: yup.string()
    .required("Password is required")
    .test("upperCase", "Password must contain at least one uppercase letter", (v) => /[A-Z]/.test(v))
    .test("lowerCase", "Password must contain at least one lowercase letter", (v) => /[a-z]/.test(v))
    .test("number", "Password must contain at least one number", (v) => /[0-9]/.test(v))
    .test("length", "Password must at least 8 characters long", (v) => v.length >= 8)
});

export function Login({ setJwt }) {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    // default values for testing
    defaultValues: {
      email: 'test1@mail.com',
      password: 'Password1',
    },
  });

  const [error, setError] = React.useState(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  const onSubmit = async (data) => {
    try {
      const { jwt } = await fetchApi('/api/login', 'POST', { body: data });
      setJwt(jwt);
      navigate(state?.from?.pathname ?? '/');
    } catch (err) {
      setError(err);
    }
  };

  return (
    <VStack as='form' onSubmit={handleSubmit(onSubmit)} p={2} maxW='400px'>
      {error && <Text color='red.500'>{error}</Text>}
      <FormControl isRequired isInvalid={errors.email}>
        <FormLabel htmlFor='email'>Email</FormLabel>
        <Input
          id='email'
          type='text'
          placeholder='johndoe@tvtracker.ie'
          {...register('email')}
          borderColor={useColorModeValue('gray.400', 'gray.600')}
        />
        <ErrorMessage
          errors={errors}
          name='email'
          render={({ messages }) => Object.values(messages).map((message, index) => <FormErrorMessage key={index} mt={1}>{message}</FormErrorMessage>)}
        />
      </FormControl>

      <FormControl isRequired isInvalid={errors.password}>
        <FormLabel htmlFor='password'>Password</FormLabel>
        <InputGroup>
          <Input
            id='password'
            type={showPassword ? 'text' : 'password'}
            placeholder='********'
            {...register('password')}
            borderColor={useColorModeValue('gray.400', 'gray.600')}
          />
          <InputRightElement>
            <Button h={7} mr={4} px={1} onClick={handleShowClick}>{showPassword ? 'Show' : 'Hide'}</Button>
          </InputRightElement>
        </InputGroup>
        <ErrorMessage
          errors={errors}
          name='password'
          render={({ messages }) => <List>{Object.values(messages).map((message, index) => <FormErrorMessage key={index} as={ListItem} mt={0}>{message}</FormErrorMessage>)}</List>}
        />
      </FormControl>
      <Button mt={4} isLoading={isSubmitting} type='submit'>Log In</Button>
    </VStack>
  );
}