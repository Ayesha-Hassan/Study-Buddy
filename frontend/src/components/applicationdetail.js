import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ApplicationDetail = () => {
  const { applicationId } = useParams();
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicationDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/application/${applicationId}`, {
          method: 'GET',
          credentials: 'include', // To send session cookie
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.msg || 'Failed to fetch application details');
          return;
        }

        const data = await response.json();
        setApplicationDetails(data); // Store the application details
      } catch (err) {
        console.error('Error:', err);
        setError('Error fetching application details');
      }
    };

    fetchApplicationDetail();
  }, [applicationId]);

  const handleApplicationStatus = async (status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/application/update/${applicationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.msg || 'Failed to update application status');
        return;
      }

      if (status === 'accepted') {
        // Redirect to a success page or notification after acceptance
        navigate('/admin/applications');
      } else {
        navigate('/admin/applications');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error handling the application status');
    }
  };

  if (error) {
    return <div style={styles.errorMessage}>{error}</div>;
  }

  if (!applicationDetails) {
    return <div style={styles.loadingState}>Loading...</div>;
  }

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.pageTitle}>Application Details</h1>
      <div style={styles.detailSection}>
        <h3>Application ID: {applicationDetails.id}</h3>
        <p><strong>Status:</strong> {applicationDetails.application_status}</p>

        <h3>Instructor Details</h3>
        <p><strong>Name:</strong> {applicationDetails.instructor_name}</p>
        <p><strong>Email:</strong> {applicationDetails.instructor_email}</p>
        <p><strong>Phone:</strong> {applicationDetails.instructor_phone}</p>

        <h3>Course Details</h3>
        <p><strong>Title:</strong> {applicationDetails.course_title}</p>
        <p><strong>Credits:</strong> {applicationDetails.course_credit_hours}</p>

        <div style={styles.buttonGroup}>
          <button
            style={styles.acceptButton}
            onClick={() => handleApplicationStatus('accepted')}
          >
            Accept
          </button>
          <button
            style={styles.rejectButton}
            onClick={() => handleApplicationStatus('rejected')}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  pageContainer: {
    padding: '30px',
    backgroundColor: '#f8f9fc',
    borderRadius: '8px',
    width: '80%',
    maxWidth: '1000px',
    margin: '30px auto',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  pageTitle: {
    fontSize: '32px',
    color: '#333',
    textAlign: 'center',
    marginBottom: '30px',
    fontWeight: '600',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '18px',
  },
  loadingState: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#333',
    fontWeight: '600',
  },
  detailSection: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  buttonGroup: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  acceptButton: {
    padding: '12px 25px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease',
  },
  acceptButtonHover: {
    backgroundColor: '#218838',
    transform: 'scale(1.05)',
  },
  rejectButton: {
    padding: '12px 25px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease',
  },
  rejectButtonHover: {
    backgroundColor: '#c82333',
    transform: 'scale(1.05)',
  },
};

// Add hover effect for buttons
const addButtonHover = (styles) => {
  return {
    acceptButton: {
      ...styles.acceptButton,
      ':hover': styles.acceptButtonHover,
    },
    rejectButton: {
      ...styles.rejectButton,
      ':hover': styles.rejectButtonHover,
    },
  };
};

export default ApplicationDetail;
