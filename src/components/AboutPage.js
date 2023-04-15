import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";

function AboutPage() {
  return (
    <div>
      <Navbar></Navbar>
<div>
<h1>About HTH World</h1>
</div>

      <div className="container my-5">
        <h1>About Us</h1>
        <p>Help The Homeless is a registered Nonprofit Corporation based in Little Egg Harbor, New Jersey, USA</p>
      </div>
    </div>
  );
}

export default AboutPage;