import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InstructorSignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [domainId, setDomainId] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [domains, setDomains] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the available domains for the instructor
    const fetchDomains = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/fetch_domains', {
          method: 'GET',
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.msg || 'Failed to fetch domains');
          return;
        }

        const data = await response.json();
        setDomains(data); // Save domains data to the state
      } catch (err) {
        console.error('Error fetching domains:', err);
        setError('Error fetching domains');
      }
    };

    fetchDomains();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    const newInstructor = {
      name,
      email,
      phone_no: phoneNo,
      domain_id: domainId,
      date_of_joining: dateOfJoining,
      password_hash: password, // You should hash the password in production
    };

    try {
      const response = await fetch('http://localhost:5000/api/instructors/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInstructor),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.msg || 'Error signing up instructor');
        return;
      }

      // Redirect to a confirmation page or login page
      alert('Instructor signed up successfully');
      navigate('/instructor/login');
    } catch (err) {
      console.error('Error:', err);
      setError('Error signing up instructor');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Instructor Sign Up</h1>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your name"
            style={styles.input}
          />
        </div>
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
          <label style={styles.label}>Phone Number:</label>
          <input
            type="text"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            required
            placeholder="Enter your phone number"
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Domain:</label>
          <select
            value={domainId}
            onChange={(e) => setDomainId(e.target.value)}
            required
            style={styles.select}
          >
            <option value="">Select Domain</option>
            {domains.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {domain.name}
              </option>
            ))}
          </select>
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Date of Joining:</label>
          <input
            type="date"
            value={dateOfJoining}
            onChange={(e) => setDateOfJoining(e.target.value)}
            required
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
        <div style={styles.inputContainer}>
          <label style={styles.label}>Confirm Password:</label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            placeholder="Confirm your password"
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Sign Up</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    width: '100%', // Ensure full width of the page
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
    padding: '10px',
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
  select: {
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
};

export default InstructorSignUp;
