import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InstructorDashboard = () => {
  const [instructorName, setInstructorName] = useState('');
  const [hoveredItem, setHoveredItem] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleMouseEnter = (item) => {
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setHoveredItem('');
  };

  return (
    <div style={styles.dashboardContainer}>
      <nav style={styles.navbar}>
        <ul style={styles.navList}>
          <li
            style={hoveredItem === 'profile' ? { ...styles.navItem, backgroundColor: '#575757' } : styles.navItem}
            onMouseEnter={() => handleMouseEnter('profile')}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate('/instructor/profile')}
          >
            Profile
          </li>
          <li
            style={hoveredItem === 'courses' ? { ...styles.navItem, backgroundColor: '#575757' } : styles.navItem}
            onMouseEnter={() => handleMouseEnter('courses')}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate('/instructor/my-courses')}
          >
            View Courses
          </li>
          <li
            style={hoveredItem === 'apply' ? { ...styles.navItem, backgroundColor: '#575757' } : styles.navItem}
            onMouseEnter={() => handleMouseEnter('apply')}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate('/instructor/apply')}
          >
            Apply for a Course
          </li>
        </ul>
      </nav>

      <div style={styles.mainContent}>
        <h1>Welcome, {instructorName || 'Instructor'}</h1>
        <p>Select an option from the navigation menu to proceed.</p>
      </div>

      <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f5f5f5', // Light gray background for the entire page
    height: '100vh', // Full screen height
    justifyContent: 'center',
    width: '100%',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#2d3b55', // Royal Blue navbar background
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
  mainContent: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    width: '80%',
    maxWidth: '800px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#e14177', // Cense red (Tomato)
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
    //width: '100%',
    transition: 'background-color 0.3s ease',
  },
  // Add hover effect for logout button
  logoutButtonHover: {
    backgroundColor: '#FF4500', // Darker red shade on hover
  }
};

export default InstructorDashboard;
