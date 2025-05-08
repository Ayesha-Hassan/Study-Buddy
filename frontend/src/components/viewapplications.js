import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/applications', {
          method: 'GET',
          credentials: 'include', // To send session cookie
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.msg || 'Failed to fetch applications');
          return;
        }

        const data = await response.json();
        setApplications(data); // Store the applications data
      } catch (err) {
        console.error('Error:', err);
        setError('Error fetching applications');
      }
    };

    fetchApplications();
  }, []);

  const handleViewApplication = (applicationId) => {
    // Navigate to the detailed application page
    navigate(`/admin/application/${applicationId}`);
  };

  const handleBackToDashboard = () => {
    // Navigate back to the dashboard
    navigate('/admin/dashboard');
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.backButtonContainer}>
        <button
          style={styles.backButton}
          onClick={handleBackToDashboard}
        >
          Back to Dashboard
        </button>
      </div>

      <h1 style={styles.pageTitle}>Applications</h1>
      {error && <div style={styles.errorMessage}>{error}</div>}
      <div style={styles.applicationList}>
        {applications.length > 0 ? (
          applications.map((application) => (
            <div key={application.id} style={styles.applicationItem}>
              <div style={styles.applicationDetails}>
                <div>
                  <strong>Application ID:</strong> {application.id}
                </div>
                <div>
                  <strong>Status:</strong> {application.application_status}
                </div>
              </div>
              <button
                onClick={() => handleViewApplication(application.id)}
                style={styles.viewButton}
              >
                View Application
              </button>
            </div>
          ))
        ) : (
          <div style={styles.noApplications}>No applications found.</div>
        )}
      </div>
    </div>
  );
};

// Styles
const styles = {
  pageContainer: {
    padding: '30px',
    backgroundColor: '#f4f7fc',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '1100px',
    margin: '30px auto',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  backButtonContainer: {
    textAlign: 'right',
    marginBottom: '20px',
  },
  backButton: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  backButtonHover: {
    backgroundColor: '#0056b3',
    transform: 'scale(1.05)',
  },
  pageTitle: {
    fontSize: '32px',
    color: '#333',
    textAlign: 'center',
    marginBottom: '30px',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '16px',
  },
  applicationList: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    maxHeight: '500px',
    overflowY: 'auto',
  },
  applicationItem: {
    padding: '20px',
    borderBottom: '1px solid #ddd',
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'background-color 0.3s ease',
  },
  applicationDetails: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '16px',
    color: '#444',
  },
  viewButton: {
    padding: '10px 20px',
    backgroundColor: '#e14177',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  viewButtonHover: {
    backgroundColor: '#0056b3',
    transform: 'scale(1.05)',
  },
  noApplications: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#555',
  },
};

// Adding hover effect for buttons
const buttonStyles = {
  ...styles.viewButton,
  ':hover': styles.viewButtonHover,
};

export default ViewApplications;
