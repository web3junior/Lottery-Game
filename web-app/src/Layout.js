import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ethers } from "ethers";
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import { Outlet, Link as RouteLink, useLocation } from "react-router-dom";
import Stack from '@mui/material/Stack';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/web3junior">
        Web3 Junior
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignInSide() {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);

  const location = useLocation();

  const login = () => {
    if(window.ethereum){
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(async (resp) => {
          setAccount(resp[0]);
          const _provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(_provider);
        });
    } else {
      console.log('please install metamask extension!');
    }
  };

  useEffect(() => {
    if(!provider){
      login();
    }
  }, [provider]); // eslint-disable-line react-hooks/exhaustive-deps

  const shortAccount = (account) => {
    let prefix = account.substring(0, 5);
    let suffix = account.substring(account.length - 4);
    let short = prefix + "..." + suffix;
    return short;
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <Grid 
          item 
          sm={12} 
          md={12} 
          component={Paper} 
          square
        >
          <Box sx={{ width: '100%', marginBottom: '20px' }}>
            <Typography component="h1" variant="h4" sx={{ zIndex: '9999', textAlign: 'center', padding: '20px' }}>
              Lottery Game Dapp
            </Typography>
            <AppBar position="static" color="transparent" elevation={0}>
              <Toolbar>
                <Stack direction="row" spacing={2} sx={{width: '100%'}}>
                  <Button variant={location.pathname === '/' ? 'outlined' : ''} sx={{ flexGrow: 1, borderRadius: 8 }} component={RouteLink} to="/">Play game</Button>
                  <Button variant={location.pathname === '/history' ? 'outlined' : ''} sx={{ flexGrow: 1, borderRadius: 8 }} component={RouteLink} to="/history">History</Button>
                  <Button color="inherit" sx={{ flexGrow: 1, borderRadius: 8 }} onClick={login}>
                    {account ? shortAccount(account) : 'Login'}
                  </Button>
                </Stack>
              </Toolbar>
            </AppBar>
          </Box>
          <Outlet/>
          <Copyright sx={{ mt: 5 }} />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}