import React, { useState, useEffect } from "react";
import Jobs from "../abi/Jobs.json";
import Web3 from 'web3';
import Navbar from "./Navbar";

function Employer() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobType, setJobType] = useState("Online");
  const [jobSalary, setJobSalary] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [jobsContract, setJobsContract] = useState(null);
  const [applicants, setApplicants] = useState([]);

  // Connect to MetaMask and initialize Web3 provider
  const connectMetaMask = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new Web3(window.ethereum);
        const accounts = await provider.eth.getAccounts();
        const jobsContract = new provider.eth.Contract(
          Jobs.abi,
          "0xF1a2a7854350E96BBbec527b02BaCd41c365b46e"
        );
        setProvider(provider);
        setAccounts(accounts);
        setJobsContract(jobsContract);
      } else {
        console.warn("MetaMask not detected. Please install MetaMask");
      }
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    connectMetaMask();
    getJobsByEmployer(); // fetch jobs when component is mounted
  }, []);

  // Create a new job posting
  const createJob = async (e) => {
    e.preventDefault();
    try {
      if (!provider || !accounts || !jobsContract) {
        console.warn("Please connect to MetaMask");
        return;
      }

      const jobTypeNum = parseInt(jobType, 10); // Convert job type to number
      const transaction = await jobsContract.methods.addJob(
        jobTitle,
        jobDescription,
        jobLocation,
        jobTypeNum, // Pass job type as a number
        Web3.utils.toWei(jobSalary.toString(), "ether")
      ).send({ from: accounts[0] });

      console.log("Job created successfully");
      getJobsByEmployer(); // fetch updated jobs list
    } catch (error) {
      console.warn(error);
    }
  };

const init = async () => {
    try {
      if (!provider || !accounts || !jobsContract) {
        console.warn("Please connect to MetaMask");
        return;
      }

      await jobsContract.methods.getJobsByEmployer(accounts[0]).call();
    } catch (error) {
      console.warn(error);
    }
  };


 const getJobsByEmployer = async (employerAddress) => {
  await init(); // add this line

  if (!jobsContract) {
    console.warn("Jobs contract is not initialized yet");
    return;
  }

  const jobs = await jobsContract.methods.getJobsByEmployer(employerAddress).call();
  const formattedJobs = await Promise.all(jobs.map(async (job) => {
    const title = await jobsContract.methods.title(job).call();
    const description = await jobsContract.methods.description(job).call();
    const location = await jobsContract.methods.location(job).call();
    const jobType = await jobsContract.methods.jobType(job).call();
    const salary = await jobsContract.methods.salary(job).call();
    const isOpen = await jobsContract.methods.isOpen(job).call();
    const applicants = await jobsContract.methods.applicants(job).call();
    const acceptedApplicant = await jobsContract.methods.acceptedApplicant(job).call();

    return {
      title,
      description,
      location,
      jobType,
      salary,
      isOpen,
      applicants,
      acceptedApplicant,
    };
  }));
  return formattedJobs;
}

  // Get a list of job applicants
  const getApplicantProfile = async (jobId, applicantAddress) => {
  try {
    const applicants = await jobsContract.methods.getApplicants(jobId).call();
    const applicant = applicants.find((applicant) => applicant === applicantAddress);
    setApplicants([applicant]);
  } catch (error) {
    console.warn(error);
  }
};

  // Accept a job applicant
  const acceptApplicant = async (applicant) => {
    try {
      const transaction = await jobsContract.methods.acceptApplicant(applicant).send({ from: accounts[0] });
      console.log("Applicant accepted");
      await getApplicantProfile(); // Refresh the list of applicants
    } catch (error) {
      console.warn(error);
    }
  };

  // Reject a job applicant
const rejectApplicant = async (applicant) => {
  try {
    const transaction = await jobsContract.methods.rejectApplicant(applicant).send({ from: accounts[0] });
    console.log("Applicant rejected");
    await getApplicantProfile(); // Refresh the list of applicants
  } catch (error) {
    console.warn(error);
  }
};

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

     <h1>Employers</h1>
  <div className="card">
    <form onSubmit={createJob}>
      <label>
        Job Title:
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
      </label>
      <br />
      <label>
        Job Description:
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </label>
      <br />
      <label>
        Job Location:
        <input
          type="text"
          value={jobLocation}
          onChange={(e) => setJobLocation(e.target.value)}
        />
      </label>
      <br />
     <label>
  Job Type 0 for online 1 for in-person:
  <input type="number" value={jobType} onChange={(e) => setJobType(e.target.value)} min="0" max="1" />
</label>
      <br />
      <label>
        Job Salary (in ETH):
        <input
          type="number"
          value={jobSalary}
          onChange={(e) => setJobSalary(e.target.value)}
        />
      </label>
      <br />
      <button type="submit" disabled={!jobsContract}>Create Job</button>
    </form>
    <hr />
    <h2>Applicants</h2>
  <ul>
  {applicants.map((applicant) => (
    <li key={applicant.id}>
      {applicant.name}{" "}
      <button onClick={() => acceptApplicant(applicant)}>Accept</button>{" "}
      <button onClick={() => rejectApplicant(applicant)}>Reject</button>
    </li>
  ))}
</ul>
  </div>
</div>
);
}

export default Employer;