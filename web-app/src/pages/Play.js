import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../constants";
import ABI from "../artifacts/contracts/LotteryGame.sol/LotteryGame.json";
import LoadingButton from '@mui/lab/LoadingButton';
import { purple } from '@mui/material/colors';
import InputAdornment from '@mui/material/InputAdornment';

const Play = () => {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [luckyNumber, setLuckyNumber] = useState('');
  const [betMoney, setBetMoney] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultLoading, setResultLoading] = useState(false);
  const [owner, setOwner] = useState("");

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

  const bet = async () => {
    setLoading(true);
    const signer = provider.getSigner();
    const Contract = new ethers.Contract(CONTRACT_ADDRESS, ABI.abi, signer);
    const _betMoney = ethers.utils.parseEther(betMoney);
    const tx = await Contract.bet(luckyNumber, {value: _betMoney});
    await tx.wait();
    setLoading(false);
    setBetMoney('');
    setLuckyNumber('');
  };

  const getOwner = async () => {
    const Contract = new ethers.Contract(CONTRACT_ADDRESS, ABI.abi, provider);
    const _owner = await Contract.owner();
    setOwner(_owner);
  }

  const getResult = async () => {
    setResultLoading(true);
    const signer = provider.getSigner()
    const Contract = new ethers.Contract(CONTRACT_ADDRESS, ABI.abi, signer);
    const tx = await Contract.endGame();
    await tx.wait();
    setResultLoading(false);
  }

  useEffect(() => {
    if(!provider){
      login();
    } else {
      getOwner();
    }
  }, [provider]); // eslint-disable-line react-hooks/exhaustive-deps

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
        Choose your number & bet
      </Typography>
      <Typography component="h1" variant="body1" sx={{ zIndex: '9999' }}>
        25 players are betting
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1, zIndex: '9999' }}>
        <TextField
          type="number"
          margin="normal"
          required
          fullWidth
          id="lucky_number"
          label="Lucky Number"
          placeholder="Should from 0 to 99"
          name="lucky_number"
          variant="standard"
          autoFocus
          value={luckyNumber}
          error={luckyNumber < 0 || luckyNumber > 99}
          onChange={(e) => setLuckyNumber(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">⭐</InputAdornment>,
          }}
        />
        <TextField
          type="number"
          margin="normal"
          required
          fullWidth
          id="bet_money"
          label="Bet Money"
          placeholder="Should > 0"
          name="bet_money"
          variant="standard"
          value={betMoney}
          error={betMoney <= 0}
          onChange={(e) => setBetMoney(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">💰</InputAdornment>,
          }}
        />
        <LoadingButton
          type="button"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3, mb: 2 }}
          onClick={bet}
          loading={loading}
        >
          bet now!
        </LoadingButton>
        {owner.toLowerCase() === account.toLowerCase() ?
        <LoadingButton
          type="button"
          fullWidth
          variant="outlined"
          size="large"
          sx={{ mt: 1, mb: 2, py: 2, borderColor: purple[500], borderWidth: 2 }}
          onClick={getResult}
          loading={resultLoading}
        >
          get result
        </LoadingButton> : ''
        }
      </Box>
    </Box>
  );
}

export default Play;