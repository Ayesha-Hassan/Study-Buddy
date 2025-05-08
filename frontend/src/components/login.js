import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include credentials (cookies) for cross-origin requests
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      alert('Login successful');
      navigate('/student/dashboard'); // Redirect to student page after successful login
    } catch (err) {
      console.error(err);
      alert('Invalid credentials');
    }
  };

  return (
    <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ color: 'royalblue' }}>Login</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Login</button>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: '12px',
  fontSize: '1rem',
  margin: '10px 0',
  border: '1px solid #ccc',
  borderRadius: '5px',
  width: '100%',
  boxSizing: 'border-box',
};

const buttonStyle = {
  padding: '12px 20px',
  fontSize: '1.2rem',
  marginTop: '20px',
  backgroundColor: 'royalblue', /* Royal Blue */
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  width: '100%',
};

export default Login;
