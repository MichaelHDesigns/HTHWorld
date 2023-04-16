import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Profiles from '../abi/Profiles.json';
import Navbar from "./Navbar";
import { useLocation, useParams } from 'react-router-dom';
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import NFTTile from "./NFTTile";
import { useWeb3React } from "@web3-react/core";
import { uploadJSONToIPFS } from "../pinata";

const UserProfiles = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [newName, setNewName] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newFacebook, setNewFacebook] = useState('');
  const [newTwitter, setNewTwitter] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [profileContract, setProfileContract] = useState(null);
  const [account, setAccount] = useState('');
  const [showForm, setShowForm] = useState(false);
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


useEffect(() => {
const init = async () => {
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
      const profileData = await contract.methods.getProfile().call({ from: accounts[0] });
      setName(profileData[0]);
      setBio(profileData[1]);
      setFacebook(profileData[2]);
      setTwitter(profileData[3]);
      setEmail(profileData[4]);
      setWebsite(profileData[5]);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log('Please install MetaMask to use this dApp');
  }
};
init();
}, []);

const handleInputChange = (event) => {
const { name, value } = event.target;
switch(name) {
case 'name':
setName(value);
break;
case 'bio':
setBio(value);
break;
case 'facebook':
setFacebook(value);
break;
case 'twitter':
setTwitter(value);
break;
case 'email':
setEmail(value);
break;
case 'website':
setWebsite(value);
break;
default:
break;
}
};

  const handleEditClick = () => {
    setShowForm(true);
  };

  const handleCancelClick = () => {
    setShowForm(false);
  };

const handleSubmit = async (event) => {
event.preventDefault();
try {
const web3 = new Web3(window.ethereum);
const accounts = await web3.eth.getAccounts();
const contract = new web3.eth.Contract(Profiles.abi, '0xeaB5a9390a173eA97510fE91057Ded09F3d2200F');
await contract.methods.updateProfile(name, bio, facebook, twitter, email, website).send({ from: accounts[0] });
} catch (error) {
console.log(error);
}
};


 

return (
<div>
            <Navbar></Navbar>
<br/>
<div>
  <h3>Hello!</h3>
{address}
</div>

 <div className="card">
      <div className="flex text-center flex-col mt-11 md:text-1xl text-white">
        <div className="mb-5">
          <h2 className="font-bold">Profile Picture</h2>
        </div>
        {data.length > 0 && (
          <div className="profilePic">
            <img src={selectedNft} alt="User's NFT" />
            <div className="selectNFT">
            <select className="selectNFT" onChange={handleNftChange}>
              {data.map((nft, index) => (
                <option key={index} value={nft.image}>
                  {nft.name}
                </option>
              ))}
            </select>
           </div>
          </div>
        )}
      </div>
    </div>


  <div className="cardProfile">
    <h1>{name}</h1>
    <p>{bio}</p>
    <p>{facebook}</p>
    <p>{twitter}</p>
    <p>{email}</p>
    <p>{website}</p>
     <div>
      <button onClick={handleEditClick}>Edit Profile</button>
      {showForm && (
        <div className="modal">
          <div className="card">
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <br />
              <label htmlFor="bio">Bio</label>
              <input
                type="text"
                id="bio"
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
              />
              <br />
              <label htmlFor="facebook">Facebook</label>
              <input
                type="text"
                id="facebook"
                value={newFacebook}
                onChange={(e) => setNewFacebook(e.target.value)}
              />
              <br />
              <label htmlFor="twitter">Twitter</label>
              <input
                type="text"
                id="twitter"
                value={newTwitter}
                onChange={(e) => setNewTwitter(e.target.value)}
              />
              <br />
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <br />
              <label htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
              />
              <br />
              <button type="submit">Update Profile</button>
              <br />
              <button type="button" onClick={handleCancelClick}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  </div>

<div className="profileClass" style={{"minHeight":"100vh"}}>
            
        <div className="flex flex-row text-center justify-center mt-10 md:text-1xl text-white">
           <div>
        <h2 className="font-bold">No. of NFTs</h2>
             {data.length}
           </div>
          <div className="ml-20">
        <h2 className="font-bold">Total Value</h2>
            {totalPrice} ETH
          </div>
        </div>
    <div className="flex flex-col text-center items-center mt-11 text-white">
        <h2 className="font-bold">Your NFTs</h2>
     <div className="flex justify-center flex-wrap max-w-screen-xl">
           {data.map((value, index) => {
           return <NFTTile data={value} key={index}></NFTTile>;
            })}
     </div>
      <div className="mt-10 text-xl">
          {data.length == 0 ? "Oops, No NFT data to display (Are you logged in?)":""}
      </div>
    </div>
  </div>

</div>


    )
};

export default UserProfiles;