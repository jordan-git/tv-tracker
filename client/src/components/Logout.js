import { Navigate } from 'react-router-dom';

export function Logout({ logOut }) {
  logOut();
  return <Navigate to='/' />;
}