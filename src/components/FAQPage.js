import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";

function FaqPage() {
  return (
    <div>
<Navbar></Navbar>
<div>
<h1>HTH World FAQ's</h1>
</div>
      <div className="container my-5">
        <h1>Frequently Asked Questions</h1>
        <ul>
          <li>
            <h4>Question 1?</h4>
            <p>Answer 1.</p>
          </li>
          <li>
            <h4>Question 2?</h4>
            <p>Answer 2.</p>
          </li>
          <li>
            <h4>Question 3?</h4>
            <p>Answer 3.</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default FaqPage;