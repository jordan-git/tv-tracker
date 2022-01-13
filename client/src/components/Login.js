import React from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../App";
import { fetchApi } from "../util";

const Text = styled.span`
  font-size: 1.5em;
  color: palevioletred;
`;

export default function Login() {
  const navigate = useNavigate();
  const { setJwt } = React.useContext(UserContext);

  const [error, setError] = React.useState(null);

  const emailRef = React.useRef();
  const passwordRef = React.useRef();

  const handleLogin = async (e) => {
    e.preventDefault();

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value
    }

    if (!payload.email || !payload.password) {
      setError('Please enter an email and password');
      return;
    }

    try {
      const { jwt } = await fetchApi('/api/users/login', 'POST', payload);

      setJwt(jwt);
      navigate('/');
    } catch (err) {
      setError(err);
    }


  }

  return (
    <>
      <Text>Login</Text>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <input type="text" name="email" ref={emailRef} />
        <input type="password" name="password" ref={passwordRef} />
        <input type="submit" value="Login" />
      </form>
    </>
  );
}