import { Button, Flex, GridItem, Link, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Spacer, Text } from "@chakra-ui/react";
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
          <Menu>
            <MenuButton as={Text} colorScheme='pink'>
              Profile
            </MenuButton>
            <MenuList>
              <MenuGroup title='Profile'>
                <MenuItem as={RouterLink} to='/profiles/me'>My Profile</MenuItem>
                <MenuItem as={RouterLink} to='/settings'>Settings</MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup title='Help'>
                <MenuItem>Docs</MenuItem>
                <MenuItem>FAQ</MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
          <Link as={RouterLink} to='/logout'>Log Out</Link>
        </>}
      </Flex>
    </GridItem>
  );
}