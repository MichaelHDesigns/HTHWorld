import { useState, useEffect } from 'react';
import Web3 from 'web3';
import Profiles from '../abi/Profiles.json';
import Navbar from "./Navbar";

function AllUsers() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccount] = useState([]);
  const [profileContract, setProfileContract] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
  const init = async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWeb3(web3);
      } catch (error) {
        console.error(error);
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      const web3 = new Web3(window.web3.currentProvider);
      setWeb3(web3);
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  };
  init();
}, []);

useEffect(() => {
  const getProfile = async () => {
    // Connect to Web3 provider via Metamask extension
if (window.ethereum) {
try {
await window.ethereum.request({ method: 'eth_requestAccounts' });
const accounts = await window.ethereum.request({ method: 'eth_accounts' });
const web3 = new Web3(window.ethereum);
setAccount(accounts[0]);

      // Load contract
      const abi = Profiles.abi;
      const address = '0xeaB5a9390a173eA97510fE91057Ded09F3d2200F'; // Replace with your contract address
      const contract = new web3.eth.Contract(abi, address);
      setProfileContract(contract);

      // Load data from contract
      const profile = await contract.methods.getProfile().call({ from: accounts[0] });
      setName(profile[0]);
      setBio(profile[1]);
      setFacebook(profile[2]);
      setTwitter(profile[3]);
      setEmail(profile[4]);
      setWebsite(profile[5]);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log('Please install MetaMask to use this dApp');
  }
};
  getProfile();
}, [web3]);


  return (
<div>
      <Navbar></Navbar>
    <div>
      {profiles.map((profile, index) => (
        <div key={index}>
          <h2>{profile.name}</h2>
          <p>{profile.bio}</p>
          <p>{profile.email}</p>
          <p>{profile.website}</p>
        </div>
      ))}
    </div>
 </div>
  );
}

export default AllUsers;