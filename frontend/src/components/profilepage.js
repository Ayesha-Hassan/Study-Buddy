import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch student's profile info
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
      } catch (err) {
        setError('Error fetching profile. Please try again later.');
        console.error(err);
      }
    };

    fetchStudentProfile();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include', // To send session cookies
      });

      if (response.ok) {
        navigate('/login'); // Redirect to login page
      } else {
        console.error('Error logging out');
      }
    } catch (err) {
      console.error('Error logging out', err);
    }
  };

  // Handle the case when student data is not available
  if (!student) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Profile Information</h1>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.profileInfo}>
        <div style={styles.infoItem}>
          <strong>Name:</strong> {student.name}
        </div>
        <div style={styles.infoItem}>
          <strong>Email:</strong> {student.email}
        </div>
        <div style={styles.infoItem}>
          <strong>Date of Birth:</strong> {new Date(student.date_of_birth).toLocaleDateString()}
        </div>
        <div style={styles.infoItem}>
          <strong>Phone Number:</strong> {student.phone_no || 'Not provided'}
        </div>
      </div>

      <button
        onClick={() => navigate('/student/edit-profile')}
        style={styles.editButton}
      >
        Edit Profile
      </button>

      <button
        onClick={() => navigate('/student/change-password')}
        style={styles.changePasswordButton}
      >
        Change Password
      </button>

      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: 'auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
  },
  title: {
    color: '#2d3b55', // Royal Blue for the title
    fontSize: '2rem',
    marginBottom: '20px',
    textAlign: 'center',
  },
  profileInfo: {
    marginBottom: '20px',
  },
  infoItem: {
    fontSize: '18px',
    marginBottom: '10px',
    color: '#333', // Dark gray text for better readability
  },
  error: {
    color: 'red',
    marginBottom: '15px',
    textAlign: 'center',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50', // Royal Green (Cense Red themed)
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '15px',
    width: '100%',
  },
  editButton: {
    padding: '10px 20px',
    backgroundColor: '#2d3b55', // Royal Blue
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '15px',
    width: '100%',
  },
  changePasswordButton: {
    padding: '10px 20px',
    backgroundColor: '#e14177', // Tomato color for distinction (matches Cense Red tone)
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '15px',
    width: '100%',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: 'royalblue', // Royal Blue for loading text
  },
};

export default StudentProfile;
