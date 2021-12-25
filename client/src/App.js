import React from "react";
import Header from "./common/Header.js";
import Login from './login/Login.js'


export default function App() {
  const [token, setToken] = React.useState(null);

  return (
    <Header />
  );
}