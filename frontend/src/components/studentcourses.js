import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/student/my-courses', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch enrolled courses');
        }

        const data = await response.json();
        setEnrolledCourses(data);
      } catch (err) {
        setError('Error fetching enrolled courses. Please try again later.');
        console.error(err);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    // Navigate to the CourseInfo page with the courseId
    navigate(`/course-info/${courseId}`);
  };

  return (
    <div style={styles.container}>
      {/* Back to Dashboard Button */}
      <button
        style={styles.backButton}
        onClick={() => navigate('/student/dashboard')}
      >
        Back to Dashboard
      </button>

      <h1 style={styles.heading}>My Enrolled Courses</h1>
      {error && <div style={styles.error}>{error}</div>}

      {/* Course List Section */}
      <div style={styles.courseList}>
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map((course) => (
            <div key={course.id} style={styles.courseItem}>
              <img
                src={course.domain_picture ? `http://localhost:5000/${course.domain_picture}` : '/default-image.jpg'}
                alt={course.domain_name}
                style={styles.courseIcon}
              />
              <div style={styles.courseDetails}>
                <h3
                  onClick={() => handleCourseClick(course.id)}
                  style={styles.courseTitle}
                >
                  {course.title}
                </h3>
                <p style={styles.courseDomain}>{course.domain_name}</p>
              </div>
            </div>
          ))
        ) : (
          <p style={styles.noCourses}>You are not enrolled in any courses yet.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginBottom: '20px',
  },
  heading: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  error: {
    color: 'red',
    marginBottom: '20px',
    fontSize: '16px',
  },
  courseList: {
    marginTop: '20px',
    width: '100%',
    display: 'block',
  },
  courseItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    borderBottom: '1px solid #e0e0e0',
    marginBottom: '15px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  courseItemHover: {
    backgroundColor: '#f1f1f1',
  },
  courseIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    marginRight: '20px',
    objectFit: 'cover',
  },
  courseDetails: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  courseTitle: {
    fontSize: '18px',
    color: '#4CAF50',
    marginBottom: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  },
  courseTitleHover: {
    color: '#45a049',
  },
  courseDomain: {
    fontSize: '16px',
    color: '#777',
    marginBottom: '10px',
  },
  noCourses: {
    fontSize: '18px',
    color: '#555',
    marginTop: '20px',
  },
};

export default MyCourses;
