import React, { useState } from 'react';
import Navbar from './Navbar';

function FaqPage() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    if (index === activeIndex) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  const faqItems = [
    {
      question: 'What is HTH World ?',
      answer: 'HTH World is a registered nonprofit helping those who are less fortunate',
    },
    {
      question: 'What is HTHW ?',
      answer: 'HTHW is our native token, commonly known as cryptocurrency, HTHW is like Ethereuem',
    },
    {
      question: 'Do you actually help those who are less fortunate ?',
      answer: 'YES!! HTH is committed to helping those who need assistance, HTH has already held several events and donated to those in need',
    },
  ];

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h1>Frequently Asked Questions</h1>
        <div className="accordion" id="faqAccordion">
          {faqItems.map((item, index) => (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header" id={`faqHeading${index}`}>
                <button
                  className={`accordion-button ${index === activeIndex ? 'active' : ''}`}
                  type="button"
                  onClick={() => toggleAccordion(index)}
                >
                  {item.question}
                </button>
              </h2>
              {index === activeIndex && (
                <div className="accordion-body">{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FaqPage;