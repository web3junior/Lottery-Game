import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../constants";
import ABI from "../artifacts/contracts/LotteryGame.sol/LotteryGame.json";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

const History = () => {
  const [provider, setProvider] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  const login = () => {
    if(window.ethereum){
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(async (resp) => {
          const _provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(_provider);
        });
    } else {
      console.log('please install metamask extension!');
    }
  };

  const getPlayers = async () => {
    setLoading(true);
    const Contract = new ethers.Contract(CONTRACT_ADDRESS, ABI.abi, provider);
    const countPlayer = await Contract.countPlayer();
    let _players = [];
    for(let count = countPlayer.toNumber(); count > 0; count--){
      const player = await Contract.players(count);
      _players.push({
        account: player.account,
        luckyNUmber: player.luckyNUmber.toNumber(),
        bet: ethers.utils.formatEther(player.bet.toNumber()),
        status: convertStatus(player.status),
      });
    }
    setPlayers(_players);
    setLoading(false);
  }

  const convertStatus = (statusInt) => {
    let statusStr;
    switch(statusInt){
      case 0 :
        statusStr = 'Pending';
        break;
      case 1 :
        statusStr = 'Winner';
        break;
      case 2 :
        statusStr = 'Closer';
        break;
      default:
        statusStr = 'Spending';
    }
    return statusStr;
  }

  useEffect(() => {
    if(!provider){
      login();
    } else {
      getPlayers()
    }
  }, [provider]); // eslint-disable-line react-hooks/exhaustive-deps

  const shortAccount = (account) => {
    let prefix = account.substring(0, 5);
    let suffix = account.substring(account.length - 4);
    let short = prefix + "..." + suffix;
    return short;
  }

  return (
    <Box
      sx={{
        mx: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5" sx={{ zIndex: '9999' }}>
        Bet history
      </Typography>
      <Typography component="h1" variant="body1" sx={{ zIndex: '9999' }}>
        Recent number: 20
      </Typography>
      <TableContainer component={Paper} sx={{ marginTop: '15px' }} elevation={0}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Account</TableCell>
              <TableCell align="center">Number</TableCell>
              <TableCell align="right">Bet money</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <ListItem sx={{paddingLeft: 0}}>
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src={`https://avatars.dicebear.com/api/identicon/${row.account}.svg`} />
                    </ListItemAvatar>
                    <ListItemText primary={shortAccount(row.account)} />
                  </ListItem>
                </TableCell>
                <TableCell align="center">{row.luckyNUmber}</TableCell>
                <TableCell align="right">{row.bet} eth</TableCell>
                <TableCell align="right"><Chip label={row.status} /></TableCell>
              </TableRow>
            ))}
            {loading?
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {[1,2,3,4].map((i) =>
                <TableCell component="th" scope="row" key={i}>
                  <Typography variant='h5'>
                    <Skeleton/>
                  </Typography>
                </TableCell>)}
              </TableRow>
            : ''}
          </TableBody>
        </Table>
        <Divider/>
      </TableContainer>
      <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{marginTop: '5px'}}>
        <Grid item xs={4}>
          <Button variant="outlined" color="inherit">Prev</Button>
        </Grid>
        <Grid item xs={4} sx={{textAlign: 'center'}}>
          Showing 1 to 2 of 2 entries
        </Grid>
        <Grid item xs={4} sx={{textAlign: 'right'}}>
          <Button variant="outlined" color="inherit">Next</Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default History;