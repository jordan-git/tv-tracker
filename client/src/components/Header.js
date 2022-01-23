import { Flex, GridItem, Link, Spacer, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { ColorModeSwitcher } from "../ColorModeSwitcher";

export function Header({ jwt }) {
  return (
    <GridItem as='header' borderBottom='2px solid gray'>
      <Flex as='nav' alignItems='baseline' p={2}>
        <Link as={RouterLink} to='/'>
          <Text fontSize='xl' fontWeight="bold">
            TV Tracker
          </Text>
        </Link>
        <Link as={RouterLink} to='/'>Home</Link>
        <Link as={RouterLink} to='/about'>About</Link>
        <Link as={RouterLink} to='/register'>Register</Link>
        <Spacer />
        <ColorModeSwitcher />
        {!jwt ? (
          <>
            <Link as={RouterLink} to='/login'>Login</Link>
            <Link as={RouterLink} to='/register'>Register</Link>
          </>
        ) : <>
          <Link as={RouterLink} to='/profiles/me'>Profile</Link>
          <Link as={RouterLink} to='/logout'>Logout</Link>
        </>}
      </Flex>
    </GridItem>
  );
}