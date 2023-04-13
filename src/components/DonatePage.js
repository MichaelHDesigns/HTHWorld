import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import DonationContract from '../abi/DonationContract.json';
import Navbar from "./Navbar";

const DonationPage = () => {
  const [totalDonations, setTotalDonations] = useState(0);
  const [donationAmount, setDonationAmount] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchTotalDonations = async () => {
      const web3 = new Web3(Web3.givenProvider);
      const contractAddr = '0x7afe38e0a012EAEbAfA2d56c49830E137742144A'; // the new contract address
      const donationContract = new web3.eth.Contract(DonationContract.abi, contractAddr);
      const totalDonationsWei = await donationContract.methods.totalDonations().call();
      const totalDonationsEth = web3.utils.fromWei(totalDonationsWei, 'ether');
      setTotalDonations(totalDonationsEth);
    };
    fetchTotalDonations();
  }, []);

  const handleDonate = async () => {
    const web3 = new Web3(Web3.givenProvider);
    const contractAddr = '0x7afe38e0a012EAEbAfA2d56c49830E137742144A'; // the new contract address
    const donationContract = new web3.eth.Contract(DonationContract.abi, contractAddr);

    const accounts = await web3.eth.getAccounts();
    const donationWei = web3.utils.toWei(donationAmount, 'ether');

    try {
      const tx = await donationContract.methods.donate().send({
        from: accounts[0],
        value: donationWei,
      });
      setStatus(`Donation successful. Transaction hash: ${tx.transactionHash}`);
      setDonationAmount('');
      const totalDonationsWei = await donationContract.methods.totalDonations().call();
      const totalDonationsEth = web3.utils.fromWei(totalDonationsWei, 'ether');
      setTotalDonations(totalDonationsEth);
    } catch (error) {
      setStatus(`Donation failed. ${error}`);
    }
  };

  return (
  <div>
<Navbar></Navbar>
<br/>
<div>
  <h1>HTHW Donations </h1>
<div className="cover-text align-middle">
    <br/>
 <div className="center">
  <img src="https://hth.world/wp-content/themes/HTHworldwide/images/hthlogo_md.png" alt="HTH Logo"/>
</div>
    <br/>
    <br/>
    Help The Homeless Worldwide offers TWO ways to Donate!
    <br/>
    Choose between PayPal or HTHW Token
    <br/>
    100% of your donations go towards
    <br/>
    helping the homeless worldwide
    <br/>
    <br/>
    <p>Donate with PayPal</p>
    <a href="https://www.paypal.com/paypalme/hthworldwide" target="_blank" rel="noopener noreferrer" className="button">DONATE TODAY</a>
  </div>
  <br/>
  <br/>
  <p>Donate with HTHW</p>
  <div className="p3">Donations to Date: {totalDonations} HTHW</div>
 <div className="card">
  <h2>Help The Homeless</h2>
  <h3>Donate Today!!</h3>
  <div className="containerDonate">
    <label htmlFor="donation-amount">Donation Amount</label>
<br/>
    <input
      id="donation-amount"
      type="number"
      step="0.01"
      value={donationAmount}
      onChange={(e) => setDonationAmount(e.target.value)}
    />
    <button onClick={handleDonate}>Donate</button>
  </div>
  <p>{status}</p>
</div>
</div>
</div>
  );
};

export default DonationPage;