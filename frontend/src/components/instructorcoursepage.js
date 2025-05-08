import React from 'react';
import { useNavigate } from 'react-router-dom';

const InstructorCoursesPage = () => {
  const navigate = useNavigate();

  const handleMyCoursesClick = () => {
    // Navigate to the instructor's courses page
    navigate('/instructor/my-courses');
  };

  const handleApplyForCourseClick = () => {
    // Navigate to the course application page
    navigate('/instructor/apply');
  };

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.heading}>Instructor Courses Page</h1>
      <p style={styles.description}>Select one of the options below to manage your courses.</p>

      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={handleMyCoursesClick}>
          My Courses
        </button>
        <button style={styles.button} onClick={handleApplyForCourseClick}>
          Apply for a Course
        </button>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    textAlign: 'center',
    padding: '30px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '900px',
    margin: '20px auto',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '20px',
  },
  description: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '30px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
  },
  button: {
    padding: '12px 25px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '18px',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    minWidth: '200px', // Ensures the button has a consistent size
  },
  buttonHover: {
    backgroundColor: '#45a049', // Slightly darker green for hover effect
    transform: 'scale(1.05)', // Small scaling effect on hover
  },
};

export default InstructorCoursesPage;
