import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ color: 'royalblue' }}>Welcome to Study Buddy</h1>
      <p style={{ fontSize: '1.2rem', color: '#333' }}>Please choose an option below:</p>
      <button 
        onClick={() => navigate('/signup')} 
        style={{
          fontSize: '18px',
          padding: '10px 20px',
          margin: '10px',
          backgroundColor: 'royalblue', /* Royal Blue */
          color: 'white', /* White text */
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
        }}>
        Sign Up
      </button>
      <button 
        onClick={() => navigate('/login')} 
        style={{
          fontSize: '18px',
          padding: '10px 20px',
          margin: '10px',
          backgroundColor: 'royalblue', /* Royal Blue */
          color: 'white', /* White text */
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
        }}>
        Login
      </button>
      <button 
        onClick={() => navigate('/instructor')} 
        style={{
          fontSize: '18px',
          padding: '10px 20px',
          margin: '10px',
          backgroundColor: '#d73a49', /* Cense Red */
          color: 'white', /* White text */
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
        }}>
        Instructor
      </button>
    </div>
  );
};

export default Landing;
