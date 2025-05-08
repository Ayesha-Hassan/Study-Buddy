import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date_of_birth: '',
    phone_no: ''
  });
  const navigate = useNavigate();

  // Fetch student's current profile info
  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies to check if the user is authenticated
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setStudent(data);
        setFormData({
          name: data.name,
          email: data.email,
          date_of_birth: data.date_of_birth,
          phone_no: data.phone_no || ''
        });
      } catch (err) {
        setError('Error fetching profile. Please try again later.');
        console.error(err);
      }
    };

    fetchStudentProfile();
  }, []);

  // Handle profile form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/edit-profile', {
        method: 'POST', // Use POST for profile update
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // To send session cookies
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      alert('Profile updated successfully!');
      navigate('/student/profile'); // Redirect to the profile page after update
    } catch (err) {
      setError('Error updating profile. Please try again later.');
      console.error(err);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Edit Profile</h1>
      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label htmlFor="name" style={styles.label}>Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="date_of_birth" style={styles.label}>Date of Birth:</label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="phone_no" style={styles.label}>Phone Number:</label>
          <input
            type="text"
            id="phone_no"
            name="phone_no"
            value={formData.phone_no}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.submitButton}>Update Profile</button>
      </form>
    </div>
  );
};

// Styles object
const styles = {
  container: {
    padding: '30px',
    maxWidth: '600px',
    margin: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  heading: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    fontSize: '16px',
    display: 'block',
    textAlign: 'left',
    marginBottom: '8px',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  submitButton: {
    padding: '12px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  submitButtonHover: {
    backgroundColor: '#45a049',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
    fontSize: '16px',
  },
};

export default EditProfile;
