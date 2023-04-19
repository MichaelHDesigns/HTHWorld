import Navbar from "./Navbar";
import { useLocation, useParams } from 'react-router-dom';
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import NFTTile from "./NFTTile";

export default function Profile () {
    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const [profile, setProfile] = useState({});
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
    }

    const params = useParams();
    const tokenId = params.tokenId;
    if(!dataFetched)
        getNFTData(tokenId);

const handleNftChange = (e) => {
    setSelectedNft(e.target.value);
  };

    return (
<div>
        <div className="profileClass" style={{"minHeight":"100vh"}}>
            <Navbar></Navbar>

      <div className="container">
  <div className="cover-text align-middle">
    <br/>

    <br/>
    Welcome to the HTHW Testnet Application. Please allow time for the API to connect & download NFTs! This is only the begining! Please leave all
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

<div className="cardProfile">
    <div className="profileImage">
      <div className="flex text-center flex-col mt-11 md:text-1xl text-white">
        <div className="mb-5">
          <h2 className="font-bold">Hello!</h2>
          {address}
        </div>
        {data.length > 0 && (
          <div className="profilePic">
            <img src={selectedNft} alt="User's NFT" />
            <div className="select">
            <select onChange={handleNftChange}>
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
 </div>





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