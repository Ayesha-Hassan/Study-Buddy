import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddDomainPage = () => {
  const [name, setName] = useState('');
  const [picture, setPicture] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setPicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setError('Domain name is required');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    if (picture) {
      formData.append('picture', picture);
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/domains', {
        method: 'POST',
        body: formData,
        credentials: 'include', // To send session cookie
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.msg || 'Failed to add domain');
        return;
      }

      alert('Domain added successfully');
      navigate('/admin/dashboard'); // Redirect to dashboard after successful addition
    } catch (err) {
      console.error('Error:', err);
      setError('Error adding domain');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Add Domain</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Domain Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={styles.input}
        />
        {error && <div style={styles.error}>{error}</div>}
        <button type="submit" style={styles.button}>Add Domain</button>
      </form>
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
    backgroundColor: 'white', // White background
    padding: '20px',
    width: '100%', // Full width
  },
  title: {
    fontSize: '2.5rem',
    color: 'royalblue', // Royal Blue for title
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
    maxWidth: '400px', // Max width for form
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    border: '2px solid royalblue', // Royal Blue border
    borderRadius: '5px',
    outline: 'none',
    transition: 'border-color 0.3s',
    width: '100%', // Full width input fields
  },
  inputFocus: {
    borderColor: '#003366', // Darker blue on focus
  },
  button: {
    padding: '12px',
    fontSize: '1.2rem',
    color: 'white',
    backgroundColor: 'royalblue', // Royal Blue for buttons
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    width: '100%', // Full width button
  },
  buttonHover: {
    backgroundColor: '#003366', // Darker shade of Royal Blue
  },
  error: {
    color: 'cense red', // Cense Red for error messages
    fontSize: '1.2rem',
  },
};

export default AddDomainPage;
