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
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquet libero eu ante fringilla congue. Nulla hendrerit gravida sapien, sit amet hendrerit odio rhoncus a. Nullam eu libero lorem. Nullam scelerisque, magna vel posuere bibendum, elit elit sollicitudin metus, in tincidunt neque massa vel quam.</p>
      </div>
    </div>
  );
}

export default AboutPage;