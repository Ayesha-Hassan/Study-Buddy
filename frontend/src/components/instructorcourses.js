import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InstructorMyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/instructor/my-coursess', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for authentication
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        setCourses(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.heading}>My Courses</h1>
      {courses.length > 0 ? (
        <div>
          {courses.map((course) => (
            <div key={course.id} style={styles.courseItem}>
              <h3 style={styles.courseTitle}>{course.title}</h3>
              <p style={styles.domainName}>{course.domain_name}</p>
              <button
                style={styles.button}
                onClick={() => navigate(`/instructor/courses/${course.id}/upload`)}
              >
                Upload Course Files
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.noCoursesText}>You are not teaching any courses yet.</p>
      )}
      <button style={styles.button} onClick={() => navigate('/instructor/dashboard')}>
        Back to Dashdoard
      </button>
    </div>
  );
};

const styles = {
  pageContainer: {
    textAlign: 'center',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '10px',
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
  courseItem: {
    padding: '20px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    textAlign: 'left',
  },
  courseTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
  },
  domainName: {
    fontSize: '16px',
    color: '#777',
    marginBottom: '15px',
  },
  button: {
    padding: '12px 25px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    minWidth: '200px',
    marginTop: '10px',
  },
  buttonHover: {
    backgroundColor: '#45a049', // Darker green on hover
    transform: 'scale(1.05)', // Slight zoom effect
  },
  loading: {
    fontSize: '18px',
    color: '#4CAF50',
    textAlign: 'center',
  },
  error: {
    fontSize: '18px',
    color: 'red',
    textAlign: 'center',
  },
  noCoursesText: {
    fontSize: '18px',
    color: '#555',
    marginTop: '20px',
  },
};

export default InstructorMyCourses;
