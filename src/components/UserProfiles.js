import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { ethers } from 'ethers';
import Profiles from '../abi/Profiles.json';
import Navbar from "./Navbar";
import { useLocation, useParams } from 'react-router-dom';
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import NFTTile from "./NFTTile";
import { useWeb3React } from "@web3-react/core";
import { uploadJSONToIPFS } from "../pinata";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new ethers.Contract(
  "0x3455A8D1B9fD1a557Bf2b19c780e6477c02510dF",
  Profiles.abi,
  provider.getSigner()
);

const UserProfiles = () => {
   const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [email, setEmail] = useState("");
  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    facebook: "",
    twitter: "",
    email: "",
  });
  const [profileContract, setProfileContract] = useState(null);
  const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const [address, updateAddress] = useState("0x");
    const [totalPrice, updateTotalPrice] = useState("0");
    const [selectedNft, setSelectedNft] = useState(data.length > 0 ? data[0].image : null);

async function getNFTData(tokenId) {
        const ethers = require("ethers");
        let sumPrice = 0;
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();

        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)

        //create an NFT Token
        let transaction = await contract.getMyNFTs()

        /*
        * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
        * and creates an object of information that is to be displayed
        */
        
        const items = await Promise.all(transaction.map(async i => {
            const tokenURI = await contract.tokenURI(i.tokenId);
            let meta = await axios.get(tokenURI);
            meta = meta.data;

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.image,
                name: meta.name,
                description: meta.description,
            }
            sumPrice += Number(price);
            return item;
        }))

        updateData(items);
        updateFetched(true);
        updateAddress(addr);
        updateTotalPrice(sumPrice.toPrecision(3));
        setSelectedNft(items.length > 0 ? items[0].image : null);
    }

    const params = useParams();
    const tokenId = params.tokenId;
    if(!dataFetched)
        getNFTData(tokenId);

const handleNftChange = (e) => {
    setSelectedNft(e.target.value);
  };


const createProfile = async () => {
  try {
    // Prompt the user to connect their Metamask account
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Create an instance of ethers.providers.Web3Provider using the current provider in Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Get the signer using the provider
    const signer = provider.getSigner();

    // Create an instance of the contract using the contract address, ABI, and signer
    const contract = new ethers.Contract(
      "0x3455A8D1B9fD1a557Bf2b19c780e6477c02510dF",
      Profiles.abi,
      signer
    );

    // Call the createProfile function on the contract using the provided parameters
    await contract.createProfile(username, bio, facebook, twitter, email);
    
    // Display a success message
    alert("Profile created successfully!");
  } catch (err) {
    console.error(err);
  }
};


  async function getProfile() {
    const address = prompt("Enter user address:");
    const profileData = await contract.getProfile(address);
    setProfile({
      username: profileData[0],
      bio: profileData[1],
      facebook: profileData[2],
      twitter: profileData[3],
      email: profileData[4],
    });
  }



  return (
    <div>
      <h1>Create a Profile</h1>
      <label>
        Username:
        <input type="text" onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Bio:
        <input type="text" onChange={(e) => setBio(e.target.value)} />
      </label>
      <label>
        Facebook:
        <input type="text" onChange={(e) => setFacebook(e.target.value)} />
      </label>
      <label>
        Twitter:
        <input type="text" onChange={(e) => setTwitter(e.target.value)} />
      </label>
      <label>
        Email:
        <input type="text" onChange={(e) => setEmail(e.target.value)} />
      </label>
      <button onClick={createProfile}>Create Profile</button>

      <h1>View Profile</h1>
      <button onClick={getProfile}>Get Profile</button>
      {profile.username && (
        <div>
          <p>Username: {profile.username}</p>
          <p>Bio: {profile.bio}</p>
          <p>Facebook: {profile.facebook}</p>
          <p>Twitter: {profile.twitter}</p>
          <p>Email: {profile.email}</p>
        </div>
      )}
    </div>
  );
}

export default UserProfiles;