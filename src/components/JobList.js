import React, { useState, useEffect } from 'react';
import Jobs from '../abi/Jobs.json';
import Web3 from 'web3';
import Navbar from "./Navbar";

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const loadJobs = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          const accounts = await web3.eth.getAccounts();
          const contract = new web3.eth.Contract(Jobs.abi, '0xF1a2a7854350E96BBbec527b02BaCd41c365b46e');
          const employerJobs = await contract.methods.getJobsByEmployer(accounts[0]).call();
          setJobs(employerJobs);
        } catch (error) {
          console.error(error);
        }
      }
    }
    loadJobs();
  }, []);

  const applyToJob = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(Jobs.abi, '0xF1a2a7854350E96BBbec527b02BaCd41c365b46e');
        await contract.methods.applyToJob(selectedJob.employer, selectedJob.index).send({ from: accounts[0] });
        setSelectedJob(null);
        alert('Applied to job successfully!');
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div>
      <Navbar></Navbar>
     <br />

<div className="container">
  <div className="cover-text align-middle">
    <br/>

    <br/>
    Welcome to the HTHW Testnet Application. Not all functions are working! This is only the begining! Please leave all
    <br/>
    of your comments, suggestions, ideas & feedback
    <br/>
    of
    <strong> HTHW in the Official HTHW Discord</strong>
    <br/>
    <br/>
    <a href="https://discord.gg/help-the-homeless-coin-459597014246883358" target="_blank" rel="noopener noreferrer" className="button">HTHW Discord</a>
  </div>
  <br/>
</div>

     <h1>Jobs List</h1>
    <div className="card">
      <ul>
        {jobs.map((job, index) => (
          <li key={index}>
            <h2>{job.title}</h2>
            <p>{job.description}</p>
            <p>Location: {job.location}</p>
            <p>Salary: {job.salary} ETH</p>
            <button onClick={() => setSelectedJob({ employer: job.employer, index: index })}>Apply to Job</button>
           <br />
          </li>
        ))}
      </ul>
      <br />
      {selectedJob &&
        <div>
          
          <p>Are you sure you want to apply to {selectedJob.title}?</p>
          <button onClick={() => applyToJob()}>Yes</button>
          <br />
          <button onClick={() => setSelectedJob(null)}>No</button>
        </div>
      }
    </div>
</div>
  );
}

export default JobsList;