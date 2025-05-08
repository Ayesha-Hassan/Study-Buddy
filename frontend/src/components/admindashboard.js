import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the logged-in admin's data
    const fetchAdminData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/dashboard', {
          method: 'GET',
          credentials: 'include', // To send session cookie
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.msg || 'Failed to fetch admin data');
          return;
        }

        // Check the response data for debugging
        const data = await response.json();
        setAdmin(data); // Store the logged-in admin's data
      } catch (err) {
        console.error('Error:', err);
        setError('Error fetching admin data');
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/logout', {
        method: 'POST',
        credentials: 'include', // Include session cookie
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.msg || 'Error logging out');
        return;
      }

      // Redirect to login page after successful logout
      navigate('/admin/login');
    } catch (err) {
      console.error('Error:', err);
      setError('Error logging out');
    }
  };

  const handleAddDomain = () => {
    // Navigate to the Add Domain page
    navigate('/admin/domains/add');
  };

  const handleAddCourse = () => {
    // Navigate to the Add Course page
    navigate('/admin/courses/add');
  };

  const handleViewApplications = () => {
    // Navigate to the View Applications page
    navigate('/admin/applications');
  };

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (!admin) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>
      <div style={styles.adminInfo}>
        <h3 style={styles.adminName}>Welcome, {admin.name}</h3>
        <p style={styles.adminDetails}>Email: {admin.email}</p>
      </div>
      <div style={styles.buttonContainer}>
        <button onClick={handleLogout} style={styles.button}>Logout</button>
        <button onClick={handleAddDomain} style={styles.button}>Add Domain</button>
        <button onClick={handleAddCourse} style={styles.button}>Add Course</button>
        <button onClick={handleViewApplications} style={styles.button}>View Applications</button>
      </div>
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
  adminInfo: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  adminName: {
    fontSize: '1.5rem',
    color: 'royalblue', // Royal Blue for admin name
  },
  adminDetails: {
    fontSize: '1rem',
    color: '#555', // Slightly dark gray for email
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '100%',
    maxWidth: '300px', // Max width for buttons container
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
    width: '100%', // Full width buttons
  },
  buttonHover: {
    backgroundColor: '#003366', // Darker shade of Royal Blue
  },
  error: {
    color: 'cense red', // Cense Red for error messages
    marginBottom: '20px',
    fontSize: '1.2rem',
  },
};

export default AdminDashboard;
