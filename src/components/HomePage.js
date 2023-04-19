import React from 'react';
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Navbar from "./Navbar";

function HomePage() {

  return (
    <div>
      <Navbar></Navbar>
<br/>
<div>
  <h1>Welcome to HTH World</h1>
</div>

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

<div className="container">
  <div className="cover-text align-middle">
    <br/>
     <div className="center">
  <img src="https://hth.world/wp-content/themes/HTHworldwide/images/hthlogo_md.png" alt="HTH Logo"/>
     </div>
    <br/>
    Help The Homeless Worldwide fully believes in their journey and knows with the help
    <br/>
    of blockchain, they can achieve their goal
    <br/>
    of
    <strong> helping the homeless worldwide.</strong>
    <br/>
    <br/>
    <a href="https://www.paypal.com/paypalme/hthworldwide" target="_blank" rel="noopener noreferrer" className="button">DONATE TODAY</a>
  </div>
  <br/>
</div>
<div className="card-container">
  <div className="card">
    <h5 className="card-title">Help The Homeless Worldwide A NJ Nonprofit Corporation</h5>
    <p className="card-text">Help The Homeless Worldwide is a 501(c)3 public charity based in Little Egg Harbor, New Jersey. We strive to incorporate blockchain technology in the aid to help the homeless population around the globe in a decentralized, trustless way.</p>
  </div>
  <div className="card">
    <h5 className="card-title">Helping those in need is a way of life</h5>
    <p className="card-text">It is a part of human nature to look out for one another, but in some cases, help is not readily available and sometimes there is not enough help.</p>
  </div>
  <div className="card">
    <h5 className="card-title">Be apart of a leading new way</h5>
    <p className="card-text">Help The Homeless Worldwide wants to change that by helping those who are in need which will also include other organizations that are under funded across the globe. Help The Homeless Worldwide fully believes in their journey and knows with the help of blockchain, they can achieve their goal of helping the homeless worldwide.</p>
  </div>
  <div className="card">
    <h5 className="card-title">Our journey is not our own</h5>
    <p className="card-text">Without the help from others, the homeless population will continue to grow leaving many people with nothing, including children regardless of their story. This is not how life is supposed to be, we are here together, as one and we should help one another the same as we help ourselves. Help The Homeless Worldwide asks that you come be apart of their amazing journey.</p>
  </div>
  <div className="card">
    <h5 className="card-title">Giving back is how we all start</h5>
    <p className="card-text">Help The Homeless Worldwide wants to give back to our community, and help those in need to thrive in life regardless of their story, and give everyone a fair chance in life. With this core belief,  Help The Homeless Worldwide will free more resources to make a larger impact on solving the homeless problem.</p>
  </div>
</div> 


</div>
  );
}

export default HomePage;
