import { Flex, Spinner } from "@chakra-ui/react";

function Loading() {
  return (
    <Flex justifyContent='center' alignItems='center'>
      <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.500'
        size='xl'
      />
    </Flex>
  );
}

export { Loading };