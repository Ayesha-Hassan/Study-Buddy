import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InstructorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const instructorCredentials = { email, password };

    try {
      const response = await fetch('http://localhost:5000/api/instructors/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(instructorCredentials),
        credentials: 'include', // Include credentials (cookies) for cross-origin requests
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || 'Invalid credentials');
      } else {
        // Successful login
        alert('Login successful');
        navigate('/instructor/dashboard'); // Redirect to the instructor's dashboard
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('Error logging in, please try again later');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Instructor Login</h1>
      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleLogin} style={styles.form}>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
      <p style={styles.signupText}>
        Don't have an account?{' '}
        <button onClick={() => navigate('/instructor/signup')} style={styles.signupLink}>
          Sign up
        </button>
      </p>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    width: '100%', // Full width for responsive design
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'white',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    color: 'royalblue', // Royal blue for the title
    marginBottom: '20px',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: '1rem',
    color: 'black',
    marginBottom: '5px',
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
    marginBottom: '10px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '1rem',
    backgroundColor: 'royalblue',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  signupText: {
    marginTop: '20px',
    fontSize: '1rem',
  },
  signupLink: {
    color: 'royalblue',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    textDecoration: 'underline',
  },
};

export default InstructorLogin;
