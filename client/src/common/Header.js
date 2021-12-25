import React from "react";
import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Home from "../home/Home.js";
import Login from "../login/Login.js";

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
    <Router>
      <HeaderElement>
        <Nav>
          <Ul>
            <Li><Link to="/">Home</Link></Li>
            <Li><Link to="/">Two</Link></Li>
            <Li><Link to="/">Three</Link></Li>
            <Li><Link to="/login">Login</Link></Li>
          </Ul>
        </Nav>
      </HeaderElement>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
      </Routes>
    </Router>


  );
}