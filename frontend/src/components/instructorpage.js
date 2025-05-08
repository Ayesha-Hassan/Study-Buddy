import React from 'react';
import { useNavigate } from 'react-router-dom';

const InstructorPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Instructor Page</h1>
      <p style={styles.description}>Please choose an option below:</p>
      <div style={styles.buttonContainer}>
        <button 
          onClick={() => navigate('/instructor/signup')} 
          style={styles.button}
        >
          Sign Up
        </button>
        <button 
          onClick={() => navigate('/instructor/login')} 
          style={styles.button}
        >
          Login
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: 'white', // Clean background
    padding: '20px',
    textAlign: 'center',
    width: '100%',
  },
  title: {
    fontSize: '2.5rem',
    color: 'royalblue', // Royal Blue for title
    marginBottom: '20px',
  },
  description: {
    fontSize: '1.2rem',
    color: 'black', // Black text for description
    marginBottom: '30px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '15px', // Space between buttons
  },
  button: {
    fontSize: '1rem',
    padding: '12px 24px',
    backgroundColor: '#e14177', // Royal Blue for buttons
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default InstructorPage;
