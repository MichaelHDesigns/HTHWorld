import logo from '../logo_3.png';
import fullLogo from '../full_logo.png';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router';

function Navbar() {
  const [isActive, setIsActive] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const [connected, toggleConnect] = useState(false);
  const [currAddress, updateAddress] = useState(localStorage.getItem('walletAddress') || '0x');

  useEffect(() => {
    // Add event listener for mouse click on window object
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsActive(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setIsActive(!isActive);
  };

  async function connectWebsite() {
    const ethereum = window.ethereum;

    if (!ethereum) {
      alert("Please install MetaMask to use this dApp");
      return;
    }

    if (ethereum.selectedAddress) {
      // User is already connected to your chain
      const address = ethereum.selectedAddress.toLowerCase();
      localStorage.setItem('walletAddress', address); // Store wallet address in local storage
      updateAddress(address);
      return;
    }

    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      const address = ethereum.selectedAddress.toLowerCase();
      localStorage.setItem('walletAddress', address); // Store wallet address in local storage
      updateAddress(address);
    } catch (error) {
      console.error(error);
      alert("Failed to connect to wallet");
    }
  }

  useEffect(() => {
    const ethereum = window.ethereum;
    if (ethereum && ethereum.selectedAddress) {
      toggleConnect(true);
      const address = ethereum.selectedAddress.toLowerCase();
      localStorage.setItem('walletAddress', address); // Store wallet address in local storage
      updateAddress(address);
    }
  }, []);

  window.ethereum.on('accountsChanged', function(accounts){
    window.location.replace(location.pathname)
  });

    return (
  <div className="">
    <header className="header">
      <nav>
        <ul className="menu">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li className="dropdown">
            <a href="#">Give</a>
            <ul>
              <li>
                <Link to="/donate">Donate</Link>
              </li>
              <li className="dropdown">
                <a href="/fundraiser-stats">Fundraisers</a>
                <ul>
                  <li>
                    <Link to="/create-fundraiser">Create A Fundraiser</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li className="dropdown">
            <a href="#">NFT</a>
            <ul>
              <li>
                <Link to="/market">Marketplace</Link>
              </li>
              <li>
                <Link to="/sellNFT">List NFT</Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li className="dropdown">
            <a href="#">Info</a>
            <ul>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
            </ul>
          </li>
              </ul>
      </nav>

  <button onClick={connectWebsite} className="connect-button">
    {connected ? currAddress.slice(0, 6) + "..." + currAddress.slice(-4) : "Connect to MetaMask"}
  </button>

    </header>

</div>
 
  
);
  }

  export default Navbar;