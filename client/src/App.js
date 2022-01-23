import {
  ChakraProvider, Flex, GridItem
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router, Navigate,
  Outlet, Route, Routes, useLocation
} from "react-router-dom";
import { About } from './components/About';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { Loading } from './components/Loading';
import { Login } from './components/Login';
import { Logout } from './components/Logout';
import { NotFound } from './components/NotFound';
import { Profile } from './components/Profile';
import { Register } from './components/Register';
import theme from './theme';
import { fetchApi } from './utils';


const ProtectedRoute = ({ jwt, setJwt }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  useEffect(() => {
    async function authToken() {
      if (!jwt) return;

      try {
        await fetchApi('/api/auth', 'GET', { headers: { Authorization: `Bearer ${jwt}` } });

        localStorage.setItem('jwt', jwt);
        setIsAuthenticated(true);
      } catch (authErr) {
        try {
          const { jwt: newJwt } = await fetchApi('/api/refresh', 'GET', { headers: { Authorization: `Bearer ${jwt}` } });

          localStorage.setItem('jwt', newJwt);
          setJwt(newJwt);
          setIsAuthenticated(true);
        } catch (refreshErr) {
          localStorage.removeItem('jwt');
          setJwt(null);
        } 
      }
    }

    authToken();
  }, []);

  // TODO: Show loading
  return jwt ? (isAuthenticated ? <Outlet /> : <Loading />) : <Navigate to='/login' replace state={{ from: location }} />
};

const UnprotectedRoute = ({ jwt }) => !jwt ? <Outlet /> : <Navigate to='/' replace />;

function App() {
  const [jwt, setJwt] = React.useState(localStorage.getItem('jwt'));

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Flex minH='100vh' direction='column'>
          <Header jwt={jwt} />
          <GridItem as={Routes}>
            <Route path="/" element={<Home />} />
            <Route path="about" element={<ProtectedRoute jwt={jwt} setJwt={setJwt} />} >
              <Route path="" element={<About />} />
            </Route>
            <Route path="register" element={<UnprotectedRoute jwt={jwt} />} >
              <Route path="" element={<Register />} />
            </Route>
            <Route path="profiles" element={<ProtectedRoute jwt={jwt} setJwt={setJwt} />} >
              <Route path="me" element={<Profile jwt={jwt} />} />
              <Route path=":userId" element={<Profile jwt={jwt} />} />
            </Route>
            <Route path="/login" element={<Login setJwt={setJwt} />} />
            <Route path="/logout" element={<Logout setJwt={setJwt}/>} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </GridItem>
          <Footer />
        </Flex>
      </Router>
    </ChakraProvider>
  );
}

export default App;
