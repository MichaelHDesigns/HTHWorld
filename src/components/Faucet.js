import React, { useState } from 'react';
import Web3 from 'web3';
import Faucet from '../abi/Faucet.json';
import Navbar from "./Navbar";

const FaucetAddress = '0x056b6Ee144A5f68Ea06bC3b9346B51e51Eb3Bc71';

function FaucetPage() {
  const [claimed, setClaimed] = useState(false);

  async function handleClick() {
    if (!claimed) {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const faucet = new web3.eth.Contract(Faucet.abi, FaucetAddress);
        await faucet.methods.getTokens().send({ from: accounts[0] });
        setClaimed(true);
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div>
      <Navbar></Navbar>
    <br />
    <div className="card">
      <button onClick={handleClick} disabled={claimed}>
        {claimed ? 'Tokens claimed' : 'Claim tokens'}
      </button>
    </div>
</div>
  );
}

export default FaucetPage;