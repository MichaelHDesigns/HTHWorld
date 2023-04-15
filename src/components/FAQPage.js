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
      question: 'Question 1?',
      answer: 'Answer 1.',
    },
    {
      question: 'Question 2?',
      answer: 'Answer 2.',
    },
    {
      question: 'Question 3?',
      answer: 'Answer 3.',
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