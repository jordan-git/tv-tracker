import {
  ChakraProvider, Flex, Grid, GridItem
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
import { Settings } from './components/Settings';
import '@fontsource/raleway/400.css'
import '@fontsource/open-sans/700.css'
import theme from './theme';
import { fetchApi } from './utils';


const ProtectedRoute = ({ jwt, logIn, logOut }) => {
  const location = useLocation();
  const [authenticated, setAuthenticated] = React.useState(false);

  useEffect(() => {
    async function authToken() {
      if (!jwt) return;

      try {
        await fetchApi('/api/auth', 'GET', { headers: { Authorization: `Bearer ${jwt}` } });

        setAuthenticated(true);
      } catch (authErr) {
        try {
          const { jwt: newJwt } = await fetchApi('/api/refresh', 'GET', { headers: { Authorization: `Bearer ${jwt}` } });

          logIn(newJwt);
          setAuthenticated(true);
        } catch (refreshErr) {
          logOut();
        }
      }
    }

    authToken();
  }, []);

  return jwt ? (authenticated ? <Outlet /> : <Loading />) : <Navigate to='/login' replace state={{ from: location }} />
};

const UnprotectedRoute = ({ jwt }) => !jwt ? <Outlet /> : <Navigate to='/' replace />;

function App() {
  const [jwt, setJwt] = React.useState(localStorage.getItem('jwt'));

  const logIn = (jwt) => {
    localStorage.setItem('jwt', jwt);
    setJwt(jwt);
  };

  const logOut = () => {
    localStorage.removeItem('jwt');
    setJwt(null);
  }

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Grid minH='100vh' templateRows='min-content auto min-content' alignItems='stretch'>
          <Header jwt={jwt} />
          <GridItem>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="settings" element={<ProtectedRoute jwt={jwt} logIn={logIn} logOut={logOut} />} >
                <Route path="" element={<Settings />} />
              </Route>
              <Route path="register" element={<UnprotectedRoute jwt={jwt} />} >
                <Route path="" element={<Register />} />
              </Route>
              <Route path="profiles" element={<ProtectedRoute jwt={jwt} logIn={logIn} logOut={logOut} />} >
                <Route path="me" element={<Profile jwt={jwt} />} />
                <Route path=":userId" element={<Profile jwt={jwt} />} />
              </Route>
              <Route path="/login" element={<Login logIn={logIn} />} />
              <Route path="/logout" element={<Logout logOut={logOut} />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </GridItem>
          <Footer />
        </Grid>
      </Router>
    </ChakraProvider>
  );
}

export default App;
