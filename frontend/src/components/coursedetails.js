import React, { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [error, setError] = useState('');
  const [studentId, setStudentId] = useState(1); // Replace with actual student ID
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch course details');
        }

        const data = await response.json();
        setCourse(data.course);
        setInstructors(data.instructors);
      } catch (err) {
        setError('Error fetching course details. Please try again later.');
        console.error(err);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  // Handle student enrollment
  const handleEnroll = async (instructorId) => {
    try {
      const response = await fetch('http://localhost:5000/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instructor_id: instructorId,
          course_id: courseId,
          student_id: studentId,
          enrollment_date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Enrollment failed');
      }

      const data = await response.json();
      alert('Successfully enrolled in the course with the instructor!');
    } catch (error) {
      alert(`Error: ${error.message}`); // Show specific error message
    }
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStars = Math.ceil(rating - fullStars);
    const emptyStars = 5 - fullStars - halfStars;

    return (
      <div style={styles.starsContainer}>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} style={styles.star}>&#9733;</span> // Full star
        ))}
        {[...Array(halfStars)].map((_, i) => (
          <span key={`half-${i}`} style={styles.starHalf}>&#189;</span> // Half star
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} style={styles.starEmpty}>&#9734;</span> // Empty star
        ))}
      </div>
    );
  };

  if (error) return <div>{error}</div>;

  return (
    <div style={styles.pageContainer}>
      {/* Back to Dashboard Button */}
      <button 
        onClick={() => navigate('/student/dashboard')} // Navigate back to the dashboard
        style={styles.backButton}
      >
        Back to Dashboard
      </button>

      {course && (
        <>
          <h1 style={styles.courseTitle}>{course.title}</h1>

          {/* Layout: Image on Left, Course Details on Right */}
          <div style={styles.courseLayout}>
            {/* Domain Image */}
            {course.domain_picture && (
              <div style={styles.imageContainer}>
                <img
                  src={`http://localhost:5000/${course.domain_picture}`}
                  alt={course.domain_name}
                  style={styles.image}
                />
              </div>
            )}

            {/* Course Details */}
            <div style={styles.courseDetails}>
              <h3 style={styles.courseInfo}>Domain: {course.domain_name}</h3>
              <p style={styles.courseInfo}>Credit Hours: {course.credit_hours}</p>
            </div>
          </div>

          {/* Instructors Section */}
          <div style={styles.instructorsContainer}>
            <h2 style={styles.instructorsTitle}>Instructors:</h2>
            <div style={styles.instructorsList}>
              {instructors.length > 0 ? (
                instructors.map((instructor) => (
                  <div key={instructor.id} style={styles.instructorCard}>
                    <h3>{instructor.name}</h3>
                    <p><strong>Email:</strong> {instructor.email}</p>

                    {/* Display the average rating as stars */}
                    <p><strong>Average Rating:</strong> {renderStars(instructor.avg_rating)}</p>

                    {/* Hardcoded Description */}
                    <p style={styles.description}>
                      {instructor.name} is an experienced instructor in {course.domain_name}. 
                      They have been teaching for several years and have contributed greatly to the success of the program.
                    </p>

                    {/* Enroll Button */}
                    <button
                      onClick={() => handleEnroll(instructor.id)}
                      style={styles.enrollButton}
                    >
                      Enroll with {instructor.name}
                    </button>
                  </div>
                ))
              ) : (
                <p>No instructors available</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f9',
    margin: '0 auto',
    width: '100%',
    overflowX: 'hidden', // Avoid any horizontal scroll if something is off-screen
  },
  courseTitle: {
    fontSize: '36px',
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
    marginTop: '50px', // Ensuring some top margin so title is visible
  },
  courseLayout: {
    display: 'flex',
    flexDirection: 'row',  // Image on the left, details on the right
    marginBottom: '30px',
    justifyContent: 'center', // Centering the layout
    alignItems: 'center', // Vertically center the items
  },
  imageContainer: {
    flex: '1',  // Image takes up 1/3 of the space
    marginRight: '4 px',  // Reduced space between image and details
    display: 'flex',
    justifyContent: 'center',  // Center image horizontally
    maxWidth: '200px',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
    width: '300px',  // Fixed size, you can adjust as needed
  },
  courseDetails: {
    flex: '2',  // Course details take up the remaining space
    backgroundColor: '#ffffff',  // Light background for the course details
    padding: '20px',  // Add padding inside the box
    borderRadius: '8px',  // Rounded corners for the box
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',  // Light shadow for depth
    marginTop: '0',  // Removed extra margin from the top
    maxWidth: '900px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: '80px',  // Adds space on the right side of course details
  },
  courseInfo: {
    fontSize: '18px',
    color: '#555',
  },
  instructorsContainer: {
    marginTop: '30px',  // Ensure there's space above the instructors section
    width: '100%',
  },
  instructorsTitle: {
    fontSize: '28px',
    color: '#333',
    marginBottom: '20px',
    width: '100%',
  },
  instructorsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
  },
  instructorCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '1000px',
    margin: '0 auto',
    width: '100%',
  },
  description: {
    fontStyle: 'italic',
    color: '#555',
    marginTop: '10px',
  },
  enrollButton: {
    marginTop: '20px',
    padding: '10px 15px',
    backgroundColor: '#e14177',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  starsContainer: {
    display: 'inline-block',
  },
  star: {
    color: 'gold',
    fontSize: '20px',
  },
  starHalf: {
    color: 'gold',
    fontSize: '20px',
  },
  starEmpty: {
    color: '#dcdcdc',
    fontSize: '20px',
  },
  backButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  }
};

export default CourseDetails;
