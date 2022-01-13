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

  const usernameRef = React.useRef();
  const emailRef = React.useRef();
  const passwordRef = React.useRef();

  const handleRegister = async (e) => {
    e.preventDefault();

    const payload = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value
    }

    if (!payload.email || !payload.password) {
      setError('Please enter an email and password');
      return;
    }

    try {
      const { jwt } = await fetchApi('/api/users/register', 'POST', payload);

      setJwt(jwt);
      navigate('/');
    } catch (err) {
      setError(err);
    }


  }

  // TODO: Finish form
  return (
    <>
      <Text>Register</Text>
      {error && <p>{error}</p>}
      <form onSubmit={handleRegister}>
        <input type="text" name="username" ref={usernameRef} />
        <input type="text" name="email" ref={emailRef} />
        <input type="password" name="password" ref={passwordRef} />
        <input type="submit" value="Register" />
      </form>
    </>
  );
}