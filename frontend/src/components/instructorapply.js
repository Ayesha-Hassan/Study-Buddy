import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InstructorApply = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  // Fetch courses assigned to the instructor
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/instructors/fetch-courses', {
          method: 'GET',
          credentials: 'include', // Include cookies for session
        });

        const data = await response.json();
        if (response.ok) {
          setCourses(data);
        } else {
          setError(data.msg);
        }
      } catch (err) {
        setError('Failed to load courses');
      }
    };

    fetchCourses();
  }, []);

  const handleMyCoursesClick = () => {
    navigate('/instructor/my-courses');
  };

  const handleApplyForCourseClick = () => {
    navigate('/instructor/apply');
  };

  const handleApplyToCourse = async (courseId) => {
    try {
      const response = await fetch('http://localhost:5000/api/instructors/apply-to-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Successfully applied to the course!');
        // Optionally re-fetch courses to update the UI
        setCourses((prevCourses) => prevCourses.filter(course => course.id !== courseId));
      } else {
        alert(data.msg || 'Failed to apply to course');
      }
    } catch (err) {
      alert('Error applying to the course');
    }
  };

  const handleGoBackToDashboard = () => {
    navigate('/instructor/dashboard');  // Adjust the path to match your main dashboard route
  };

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.heading}>Instructor Courses Page</h1>
      <p style={styles.description}>Select one of the options below:</p>

      <div style={styles.buttonGroup}>
        <button style={styles.button} onClick={handleMyCoursesClick}>
          My Courses
        </button>
        <button style={styles.button} onClick={handleApplyForCourseClick}>
          Apply for a Course
        </button>
        <button style={styles.button} onClick={handleGoBackToDashboard}>
          Back to Dashboard
        </button>
      </div>

      <h2 style={styles.subHeading}>My Available Courses</h2>
      {error && <div style={styles.error}>{error}</div>}

      <ul style={styles.courseList}>
        {courses.length > 0 ? (
          courses.map(course => (
            <li key={course.id} style={styles.courseItem}>
              <div style={styles.courseDetails}>
                <strong>{course.title}</strong>
                <div style={styles.courseInfo}>
                  <span>{course.domain_name} - {course.credit_hours} credits</span>
                </div>
              </div>
              <button
                style={styles.applyButton}
                onClick={() => handleApplyToCourse(course.id)}
              >
                Apply
              </button>
            </li>
          ))
        ) : (
          <li style={styles.noCourses}>No courses available for application</li>
        )}
      </ul>
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
  description: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '30px',
  },
  buttonGroup: {
    marginBottom: '30px',
  },
  button: {
    padding: '12px 25px',
    backgroundColor: '#e14177',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    minWidth: '200px',
    marginTop: '10px',
    marginRight: '15px',
  },
  subHeading: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  error: {
    fontSize: '16px',
    color: 'red',
    marginBottom: '20px',
  },
  courseList: {
    listStyleType: 'none',
    paddingLeft: '0',
    textAlign: 'left',
  },
  courseItem: {
    padding: '15px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseDetails: {
    fontSize: '16px',
    color: '#333',
    maxWidth: '70%',
  },
  courseInfo: {
    fontSize: '14px',
    color: '#555',
    marginTop: '5px',
  },
  applyButton: {
    padding: '8px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  noCourses: {
    fontSize: '16px',
    color: '#777',
    marginTop: '20px',
  },
};

export default InstructorApply;
