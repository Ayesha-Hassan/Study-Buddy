import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CourseInfo = () => {
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const { courseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/student/courses/${courseId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch course info');
        }

        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError('Error fetching course details. Please try again later.');
        console.error(err);
      }
    };

    fetchCourseInfo();
  }, [courseId]);

  // Submit the rating
  const handleRatingSubmit = async (instructorId) => {
    try {
      const response = await fetch('http://localhost:5000/api/student/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          instructorId,
          courseId,
          rating,
        }),
      });

      if (response.ok) {
        setSuccessMessage('Rating submitted successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.msg || 'Error submitting rating');
      }
    } catch (err) {
      setError('Error submitting rating. Please try again later.');
      console.error(err);
    }
  };

  return (
    <div style={styles.pageContainer}>
      {error && <div style={styles.errorMessage}>{error}</div>}
      {successMessage && <div style={styles.successMessage}>{successMessage}</div>}

      {course ? (
        <div style={styles.courseDetails}>
          <h1 style={styles.courseTitle}>{course.title}</h1>
          <p><strong>Domain:</strong> {course.domain_name}</p>
          <p><strong>Credits:</strong> {course.credit_hours} hours</p>

          {/* View Course Content Button */}
          <button
            style={styles.viewContentButton}
            onClick={() => navigate(`/course/${courseId}/content`)}
          >
            View Course Content
          </button>

          {/* Display Instructors */}
          <div style={styles.instructorsList}>
            <h2 style={styles.instructorHeader}>Instructors</h2>
            {course.instructors && course.instructors.length > 0 ? (
              course.instructors.map((instructor, index) => (
                <div key={index} style={styles.instructorItem}>
                  <p><strong>Name:</strong> {instructor.instructor_name}</p>
                  <p><strong>Email:</strong> {instructor.instructor_email}</p>
                  <p><strong>Phone:</strong> {instructor.instructor_phone}</p>

                  {/* Add Rating System */}
                  <div style={styles.ratingSection}>
                    <strong>Rate this Instructor:</strong>
                    <div style={styles.ratingStars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          style={{
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: rating >= star ? '#FFD700' : '#ccc',
                          }}
                          onClick={() => setRating(star)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <button
                      style={styles.submitRatingButton}
                      onClick={() => handleRatingSubmit(instructor.instructor_id)}
                    >
                      Submit Rating
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No instructors found for this course.</p>
            )}
          </div>
        </div>
      ) : (
        <p>Loading course details...</p>
      )}

      {/* Back to My Courses Button */}
      <button
        style={styles.backButton}
        onClick={() => navigate('/student/my-courses')}
      >
        Back to My Courses
      </button>
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    fontSize: '16px',
    marginBottom: '10px',
  },
  successMessage: {
    color: 'green',
    textAlign: 'center',
    fontSize: '16px',
    marginBottom: '10px',
  },
  courseDetails: {
    padding: '20px',
    backgroundColor: '#ffffff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    marginTop: '20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  courseTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  viewContentButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#e14177',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  instructorsList: {
    marginTop: '20px',
  },
  instructorHeader: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#333',
  },
  instructorItem: {
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    marginBottom: '15px',
    backgroundColor: '#f9f9f9',
  },
  ratingSection: {
    marginTop: '15px',
  },
  ratingStars: {
    marginBottom: '10px',
  },
  submitRatingButton: {
    marginTop: '10px',
    padding: '8px 15px',
    backgroundColor: '#e14177',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  backButton: {
    marginTop: '30px',
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default CourseInfo;
