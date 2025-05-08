import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // State to track hover (menu visibility)
  const [menuVisible, setMenuVisible] = useState(false);

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include credentials (cookies) for cross-origin requests
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        setCourses(data);
        setFilteredCourses(data); // Initially show all courses
      } catch (err) {
        setError('Error fetching courses. Please try again later.');
        console.error(err);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on the search query
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  
    const filtered = courses.filter((course) => {
      const instructorMatch = (course.instructor_name || '').toLowerCase().includes(query); // Safely handle undefined
      const courseMatch = (course.title || '').toLowerCase().includes(query); // Safely handle undefined
      const domainMatch = (course.domain_name || '').toLowerCase().includes(query); // Safely handle undefined
      return instructorMatch || courseMatch || domainMatch;
    });
  
    setFilteredCourses(filtered);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include', // To send session cookies
      });

      if (response.ok) {
        navigate('/'); // Redirect to login page
      } else {
        console.error('Error logging out');
      }
    } catch (err) {
      console.error('Error logging out', err);
    }
  };

  const handleViewCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div style={styles.container}>
      {/* Navigation Bar */}
      <div style={styles.navbar}>
        <div
          style={styles.iconContainer}
          onMouseEnter={() => setMenuVisible(true)}
          onMouseLeave={() => setMenuVisible(false)}
        >
          <div style={styles.roundIcon} title="User Menu">
            <span style={styles.iconText}>☰</span>
          </div>

          {/* Dropdown menu */}
          <div
            style={{
              ...styles.dropdown,
              opacity: menuVisible ? 1 : 0, // Control visibility with opacity
              visibility: menuVisible ? 'visible' : 'hidden', // Ensure it hides completely
              pointerEvents: menuVisible ? 'auto' : 'none', // Allow interaction when visible
              transition: 'opacity 0.3s ease, visibility 0s linear 0.3s, transform 0.3s ease', // Smooth transition
              transitionDelay: menuVisible ? '0s' : '0.3s', // Delay disappearance for smooth effect
            }}
          >
            <ul style={styles.dropdownList}>
              <li
                style={styles.dropdownItem}
                onClick={() => navigate('/student/profile')}
              >
                Go to Profile
              </li>
              <li
                style={styles.dropdownItem}
                onClick={() => navigate('/student/my-courses')}
              >
                My Courses
              </li>
              <li
                style={styles.dropdownItem}
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by Instructor, Course, or Domain"
          style={styles.searchBar}
        />
      </div>

      <h1 style={styles.title}>Student Dashboard</h1>
      {error && <div style={styles.error}>{error}</div>}

      {/* Course List Section */}
      <div style={styles.courseList}>
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course.id} style={styles.courseItem}>
              <img
                src={course.domain_picture ? `http://localhost:5000/${course.domain_picture}` : '/default-image.jpg'}
                alt={course.domain_name}
                style={styles.courseIcon}
              />
              <div style={styles.courseDetails}>
                <h3>{course.title}</h3>
                <p>{course.domain_name}</p>
                <button 
                  style={styles.viewButton} 
                  onClick={() => handleViewCourse(course.id)}
                >
                  View Course
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No courses available</p>
        )}
      </div>
    </div>
  );
};

// Styles with theme applied
const styles = {
  container: {
    width: '100%',
    padding: '20px',
    minHeight: '100vh', // Ensure the container spans full viewport height
    overflowY: 'auto',  // Enable vertical scrolling when content overflows
    backgroundColor: 'white', // Use white background for the page
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#2d3b55', // Royal Blue
    color: 'white',
    position: 'relative',
    width: '100%',
  },
  iconContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  roundIcon: {
    width: '50px',
    height: '50px',
    backgroundColor: '#333',
    borderRadius: '50%',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '24px',
  },
  iconText: {
    fontSize: '24px',
  },
  dropdown: {
    position: 'absolute',
    top: '60px',
    right: '0',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    zIndex: '100',
    opacity: 0,
    visibility: 'hidden',
    pointerEvents: 'none',
  },
  dropdownList: {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
  },
  dropdownItem: {
    padding: '10px',
    cursor: 'pointer',
    borderBottom: '1px solid #ccc',
    color: '#333',
    backgroundColor: 'white',
  },
  searchBar: {
    padding: '8px 12px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
    marginLeft: '20px',
  },
  title: {
    fontSize: '2rem',
    color: 'royalblue', // Royal Blue for title
    marginTop: '20px',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
  },
  courseList: {
    marginTop: '20px',
    display: 'block',
    width: '100%',
  },
  courseItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    borderBottom: '1px solid #ccc',
    marginBottom: '10px',
    textAlign: 'left',
    width: '100%',
  },
  courseIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    marginRight: '15px',
  },
  courseDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  viewButton: {
    marginTop: '10px',
    padding: '5px 15px',
    backgroundColor: '#e14177', // Cense Red for button
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default StudentDashboard;
