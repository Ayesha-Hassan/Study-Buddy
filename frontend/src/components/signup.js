import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Optional: Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return;
    }

    // Optional: Validate phone number format (simple validation)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (phoneNo && !phoneRegex.test(phoneNo)) {
      setError('Invalid phone number format');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, date_of_birth: dateOfBirth, phone_no: phoneNo, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Error signing up');
        return;
      }

      alert('Sign up successful');
      navigate('/login'); // Redirect to login page after successful sign up
    } catch (err) {
      console.error(err);
      setError('Error signing up');
    }
  };

  return (
    <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ color: 'royalblue' }}>Sign Up</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="date"
          placeholder="Date of Birth"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Phone Number (optional)"
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={inputStyle}
        />
        {error && <div style={{ color: '#d73a49', marginTop: '10px' }}>{error}</div>}
        <button type="submit" style={buttonStyle}>Sign Up</button>
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

export default SignUp;
