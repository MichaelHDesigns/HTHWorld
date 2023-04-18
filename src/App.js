import './App.css';
import Navbar from './components/Navbar.js';
import Marketplace from './components/Marketplace';
import SellNFT from './components/SellNFT';
import NFTPage from './components/NFTpage';
import AboutPage from './components/AboutPage';
import HomePage from './components/HomePage';
import FAQPage from './components/FAQPage';
import DonatePage from './components/DonatePage';
import CreateCampaign from './components/CreateCampaign';
import AllFundraisers from './components/AllFundraisers';
import Profile from './components/Profile';
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/create-fundraiser" element={<CreateCampaign />} />
          <Route path="/fundraiser-stats" element={<AllFundraisers />} />
          <Route path="/market" element={<Marketplace />}/>
          <Route path="/nftPage" element={<NFTPage />}/>        
          <Route path="/profile" element={<Profile />}/>
          <Route path="/sellNFT" element={<SellNFT />}/>             
        </Routes>
    </div>
  );
}

export default App;
