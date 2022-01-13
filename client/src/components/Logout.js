import React from "react";
import {
  Navigate
} from "react-router-dom";
import {
  UserContext,
} from '../App.js'

export default function Logout() {
  const { setJwt } = React.useContext(UserContext);

  setJwt(null);

  return <Navigate to="/" />;
}