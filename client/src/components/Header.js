import React from "react";
import styled from 'styled-components';
import {
  Link,
} from "react-router-dom";
import { UserContext } from "../App.js";
// TODO: Export all components from an index file

const HeaderElement = styled.header`
`;

const Nav = styled.nav`
  
`;

const Ul = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Li = styled.li`
  padding: 20px 30px;
`;

export default function Header() {
  return (
    <UserContext.Consumer>
      {({ jwt }) => (
        <HeaderElement>
          <Nav>
            <Ul>
              <Li><Link to="/">Home</Link></Li>
              {
                jwt ? (
                  <>
                    <Li><Link to="/settings">Settings</Link></Li>
                    <Li><Link to="/profile">Profile</Link></Li>
                    <Li><Link to="/logout">Logout</Link></Li>
                  </>
                ) : (
                  <>
                    <Li><Link to="/login">Login</Link></Li>
                    <Li><Link to="/register">Register</Link></Li>
                  </>
                )
              }
            </Ul>
          </Nav>
        </HeaderElement>
      )}
    </UserContext.Consumer>
  );
}