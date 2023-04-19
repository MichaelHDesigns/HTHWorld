import React, { useState } from "react";
import Jobs from "../abi/Jobs.json";
import Navbar from "./Navbar";

function Applicant() {
  const [jobId, setJobId] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [skills, setSkills] = useState("");

  const applyForJob = async () => {
    const jobsContract = await Jobs.deployed();
    await jobsContract.applyForJob(jobId, name, age, skills);
  };

  return (
    <div>
      <Navbar></Navbar>
    <div>
      <h1>Apply for a Job</h1>
      <form onSubmit={applyForJob}>
        <input
          type="number"
          value={jobId}
          placeholder="Job ID"
          onChange={(e) => setJobId(e.target.value)}
        />
        <input
          type="text"
          value={name}
          placeholder="Your Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          value={age}
          placeholder="Your Age"
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          type="text"
          value={skills}
          placeholder="Your Skills"
          onChange={(e) => setSkills(e.target.value)}
        />
        <button type="submit">Apply for Job</button>
      </form>
    </div>
</div>
  );
}

export default Applicant;