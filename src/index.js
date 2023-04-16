import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import SellNFT from './components/SellNFT';
import Marketplace from './components/Marketplace';
import NFTPage from './components/NFTpage';
import AboutPage from './components/AboutPage';
import HomePage from './components/HomePage';
import FAQPage from './components/FAQPage';
import DonatePage from './components/DonatePage';
import CreateCampaign from './components/CreateCampaign';
import AllFundraisers from './components/AllFundraisers';
import UserProfiles from './components/UserProfiles';
import AllUsers from './components/AllUsers';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/create-fundraiser" element={<CreateCampaign />} />
          <Route path="/fundraiser-stats" element={<AllFundraisers />} />
          <Route path="/market" element={<Marketplace />}/>
          <Route path="/sellNFT" element={<SellNFT />}/> 
          <Route path="/nftPage/:tokenId" element={<NFTPage />}/>        
          <Route path="/user-profile" element={<UserProfiles />}/>
          <Route path="/all-users" element={<AllUsers />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();