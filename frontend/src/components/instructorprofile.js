import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InstructorProfile = () => {
  const [instructor, setInstructor] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/instructors/profile', {
          method: 'GET',
          credentials: 'include', // Include cookies for session
        });

        const data = await response.json();

        if (response.ok) {
          setInstructor(data);
        } else {
          setError(data.msg || 'Error fetching profile');
        }
      } catch (err) {
        setError('Failed to load profile');
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/instructor/logout', {
        method: 'POST',
        credentials: 'include', // Include session cookie
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.msg || 'Error logging out');
        return;
      }

      // Redirect to login page after successful logout
      navigate('/');
    } catch (err) {
      console.error('Error:', err);
      setError('Error logging out');
    }
  };

  return (
    <div style={styles.profileContainer}>
      <nav style={styles.navbar}>
        <ul style={styles.navList}>
          <li style={styles.navItem} onClick={() => navigate('/instructor/dashboard')}>Dashboard</li>
          <li style={styles.navItem} onClick={() => navigate('/instructor/my-courses')}>View Courses</li>
          <li style={styles.navItem} onClick={() => navigate('/instructor/apply')}>Apply for a Course</li>
        </ul>
      </nav>

      <div style={styles.profileContent}>
        <h1>Instructor Profile</h1>
        {error && <div style={styles.error}>{error}</div>}

        {instructor ? (
          <div style={styles.profileDetails}>
            <p><strong>Name:</strong> {instructor.name}</p>
            <p><strong>Email:</strong> {instructor.email}</p>
            <p><strong>Phone Number:</strong> {instructor.phone_no}</p>
            <p><strong>Domain:</strong> {instructor.domain_name}</p>
            <p><strong>Date of Joining:</strong> {new Date(instructor.date_of_joining).toLocaleDateString()}</p>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}

        <div style={styles.buttonsContainer}>
          {/* Back to Dashboard Button */}
          <button onClick={() => navigate('/instructor/dashboard')} style={styles.backButton}>Back to Dashboard</button>
          
          {/* Logout Button */}
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  profileContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    height: '100vh',
    justifyContent: 'center',
    width: '100%',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#2d3b55',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  navList: {
    display: 'flex',
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
  navItem: {
    padding: '10px 20px',
    color: 'white',
    fontSize: '18px',
    cursor: 'pointer',
    margin: '0 15px',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
  },
  profileContent: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    width: '80%',
    maxWidth: '800px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  profileDetails: {
    textAlign: 'left',
    fontSize: '18px',
    marginTop: '20px',
  },
  error: {
    fontSize: '16px',
    color: 'red',
    marginBottom: '20px',
  },
  buttonsContainer: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '800px',
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50', // Green for back button
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#e14177', // Red for logout button
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default InstructorProfile;
