import { Navigate } from 'react-router-dom';

export function Logout({ setJwt }) {
  setJwt(null);
  return <Navigate to='/' />;
}