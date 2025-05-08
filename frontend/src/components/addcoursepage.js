import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCoursePage = () => {
  const [title, setTitle] = useState('');
  const [creditHours, setCreditHours] = useState('');
  const [domainId, setDomainId] = useState('');
  const [domains, setDomains] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of domains
    const fetchDomains = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/fetch_domains', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.msg || 'Failed to fetch domains');
          return;
        }

        const data = await response.json();
        setDomains(data); // Store the domains
      } catch (err) {
        console.error('Error:', err);
        setError('Error fetching domains');
      }
    };

    fetchDomains();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !creditHours || !domainId) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, creditHours, domainId }),
        credentials: 'include', // Send session cookie
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.msg || 'Failed to add course');
        return;
      }

      alert('Course added successfully');
      navigate('/admin/dashboard'); // Redirect to the admin dashboard
    } catch (err) {
      console.error('Error:', err);
      setError('Error adding course');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Add Course</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Credit Hours"
          value={creditHours}
          onChange={(e) => setCreditHours(e.target.value)}
          required
          style={styles.input}
        />
        <select
          value={domainId}
          onChange={(e) => setDomainId(e.target.value)}
          required
          style={styles.input}
        >
          <option value="">Select Domain</option>
          {domains.map((domain) => (
            <option key={domain.id} value={domain.id}>
              {domain.name}
            </option>
          ))}
        </select>
        {error && <div style={styles.error}>{error}</div>}
        <button type="submit" style={styles.button}>Add Course</button>
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
    backgroundColor: 'white', // White background for clean look
    padding: '20px',
    width: '100%', // Full width
  },
  title: {
    fontSize: '2.5rem',
    color: 'royalblue', // Royal Blue for the title
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
    backgroundColor: '#003366', // Darker shade of Royal Blue on hover
  },
  error: {
    color: 'cense red', // Cense Red for error messages
    fontSize: '1.2rem',
  },
};

export default AddCoursePage;
