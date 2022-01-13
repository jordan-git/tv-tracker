import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./components/Home.js";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import Header from "./components/Header.js";
import NotFound from "./components/NotFound.js";
import Settings from "./components/Settings.js";
import Profile from "./components/Settings.js";
import Logout from "./components/Logout.js";

export const UserContext = React.createContext();

// TODO: Protect routes

export default function App() {
  const [jwt, setJwt] = React.useState(null);

  return (
    <UserContext.Provider value={{ jwt, setJwt }}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={< Home />} />
          <Route path="/login" element={<Login />} />
          {<Route path="/register" element={
            !jwt ? < Register /> : <Navigate to='/' />
          } />}
          {<Route path="/settings" element={
            jwt ? < Settings /> : <Navigate to='/login' />
          } />}
          <Route path="/profile" element={
            jwt ? < Profile /> : <Navigate to='/login' />
          } />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}