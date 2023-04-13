import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import { ethers } from 'ethers';
import CrowdFunding from '../abi/CrowdFunding.json';
import Navbar from "./Navbar";

const AllFundraisers = () => {
  const [fundraisers, setFundraisers] = useState([]);
  const [totalAmountRaised, setTotalAmountRaised] = useState(0);

  const fetchData = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.enable();
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(CrowdFunding.abi, '0x1cdd7Ac8B83843e35C417Ef3C293be3051Ae1bca');

        const totalRaised = await contract.methods.getTotalAmountRaised().call();
        setTotalAmountRaised(ethers.utils.formatEther(totalRaised));

        const numFundraisers = await contract.methods.getFundraiserCount().call();
        const fundraiserDetails = await Promise.all(
          Array.from({ length: numFundraisers }, (_, index) => contract.methods.getFundraiserDetails(index).call())
        ).then((details) =>
          details.map((detail) => ({
            creator: detail[0],
            fundingGoal: ethers.utils.formatEther(detail[1]),
            deadline: formatDate(detail[2]),
            amountRaised: ethers.utils.formatEther(detail[3]),
            isOpen: detail[4],
            title: detail[5],
            description: detail[6],
            contractAddress: contract.options.address, // add the contract address to the fundraiser details
          }))
        );
        setFundraisers(fundraiserDetails);
      } else {
        console.log('Please install MetaMask to use this dApp!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    return `${formattedDate} at ${formattedTime}`;
  };

// Function to handle contributing to a campaign
const contributeToCampaign = async (index) => {
  try {
    if (window.ethereum) {
      await window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(CrowdFunding.abi, '0x1cdd7Ac8B83843e35C417Ef3C293be3051Ae1bca');

      const value = window.prompt('How much do you want to contribute (in ETH)?');
      if (!value || isNaN(value)) {
        throw new Error('Please enter a valid amount.');
      }

      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      const weiValue = ethers.utils.parseEther(value);

      await contract.methods.contribute(index).send({ from: address, value: weiValue });

      // Refresh the list of fundraisers after contributing
      fetchData();
    } else {
      console.log('Please install MetaMask to use this dApp!');
    }
  } catch (error) {
    console.error(error);
  }
};

const getProgress = (amountRaised, fundingGoal) => {
  const percentComplete = (amountRaised * 100) / fundingGoal;
  return percentComplete > 100 ? 100 : percentComplete;
};


  return (
<div>
<Navbar></Navbar>
<br/>
<div>
<div>
<h1>All Fundraisers</h1>
</div>
  <p>Total Amount Raised: {totalAmountRaised} HTHW</p>
 <br/>
  <div className="card-container">
    {fundraisers.map((fundraiser, index) => (
      <div className="card" key={index}>
        <h2>{fundraiser.title}</h2>
        <p><strong>Creator:</strong> {fundraiser.creator}</p>
        <p><strong>Description:</strong> {fundraiser.description}</p>
        <p><strong>Funding Goal:</strong> {fundraiser.fundingGoal} HTHW</p>
        <p><strong>Amount Raised:</strong> {fundraiser.amountRaised} HTHW</p>
        <p><strong>Progress:</strong> {getProgress(fundraiser.amountRaised, fundraiser.fundingGoal)}%</p>
        <p><strong>Deadline:</strong> {fundraiser.deadline}</p>
        <p><strong>Status:</strong> {fundraiser.isOpen ? 'Open' : 'Closed'}</p>
        {fundraiser.isOpen && (
          <button onClick={() => contributeToCampaign(index)}>Contribute</button>
        )}
      </div>
    ))}
  </div>
</div>
</div>
);
}

export default AllFundraisers;