import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CrowdFunding from '../abi/CrowdFunding.json';
import { ethers } from 'ethers';
import Navbar from "./Navbar";

function CreateCampaign(props) {
  const [fundingGoal, setFundingGoal] = useState('');
  const [deadline, setDeadline] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const createFundraiser = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract('0x1cdd7Ac8B83843e35C417Ef3C293be3051Ae1bca', CrowdFunding.abi, signer);
    const tx = await contract.createFundraiser(
      ethers.utils.parseEther(fundingGoal),
      Math.floor(Date.parse(deadline) / 1000),
      title,
      description
    );
    await tx.wait();
    setFundingGoal('');
    setDeadline('');
    setTitle('');
    setDescription('');
  };

  return (
<div>
<Navbar></Navbar>
<br/>
<div>
<h1>Create Fundraiser</h1>
</div>
    <div className="card">
      <form onSubmit={e => { e.preventDefault(); createFundraiser(); }}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Description:</label>
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div>
          <label>Funding Goal:</label>
          <input type="text" value={fundingGoal} onChange={e => setFundingGoal(e.target.value)} />
        </div>
        <div>
          <label>Deadline:</label>
          <input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} />
        </div>
        <button type="submit">Create Fundraiser</button>
      </form>
    </div>
</div>
  );
}

export default CreateCampaign;