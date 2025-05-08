import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate(); // Hook to navigate between pages
  const [activeTab, setActiveTab] = useState('content');
  const [generalContent, setGeneralContent] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [instructorId, setInstructorId] = useState(null);
  const [loadingInstructor, setLoadingInstructor] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);  // State for storing selected file

  useEffect(() => {
    const fetchInstructorId = async () => {
      setLoadingInstructor(true);
      try {
        const response = await fetch(`http://localhost:5000/api/enrollments/instructor?course_id=${courseId}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch instructor ID');
        }
        const data = await response.json();
        setInstructorId(data.instructor_id); 
      } catch (error) {
        console.error("Error fetching instructor ID:", error);
      } finally {
        setLoadingInstructor(false);
      }
    };

    fetchInstructorId();
  }, [courseId]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!instructorId) return;

      setLoadingQuizzes(true);
      try {
        const response = await fetch(`http://localhost:5000/api/instructor/${instructorId}/courses/${courseId}/content/quizzes`);
        if (!response.ok) {
          throw new Error('Failed to fetch quizzes');
        }
        const data = await response.json();
        setQuizzes(data.quizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoadingQuizzes(false);
      }
    };

    if (activeTab === 'quizzes' && instructorId) {
      fetchQuizzes();
    }
  }, [activeTab, instructorId, courseId]);

  const fetchGeneralContent = async () => {
    if (!instructorId) return;

    setLoadingContent(true);
    try {
      const response = await fetch(`http://localhost:5000/api/instructors/${instructorId}/courses/${courseId}/content`);
      if (!response.ok) {
        throw new Error('Failed to fetch general content');
      }
      const data = await response.json();
      setGeneralContent(data.files);
    } catch (error) {
      console.error("Error fetching general content:", error);
    } finally {
      setLoadingContent(false);
    }
  };

  // Select a file from the sidebar and display it
  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  // Handle the "Back to Course Page" button click
  const handleBackToCoursePage = () => {
    navigate(`/course-info/${courseId}`);  // Navigates to the course page using courseId
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarHeader}>Course Content</h2>
        {loadingContent ? (
          <p>Loading content...</p>
        ) : (
          <ul style={styles.contentList}>
            {generalContent.length > 0 ? (
              generalContent.map((file, index) => (
                <li
                  key={index}
                  onClick={() => handleFileSelect(file)}
                  style={styles.contentItem}
                >
                  {file.name}
                </li>
              ))
            ) : (
              <p>No content available for this course.</p>
            )}
          </ul>
        )}
      </div>

      {/* Main Content Area */}
      <div style={styles.mainContent}>
        <h1 style={styles.heading}>Course Content for {courseId}</h1>

        {/* Back to Course Page Button */}
        <button
          onClick={handleBackToCoursePage}
          style={styles.backButton}
        >
          Back to Course Page
        </button>

        {/* Loading Instructor */}
        {loadingInstructor && <p>Loading instructor...</p>}

        {/* Instructor ID */}
        {instructorId && <p>Instructor ID: {instructorId}</p>}

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            onClick={() => {
              setActiveTab('content');
              fetchGeneralContent();
            }}
            style={activeTab === 'content' ? styles.activeTabButton : styles.tabButton}
          >
            General Content
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            style={activeTab === 'quizzes' ? styles.activeTabButton : styles.tabButton}
          >
            Quizzes
          </button>
        </div>

        {/* Content Rendering */}
        {activeTab === 'content' && (
          <div>
            {selectedFile ? (
              <div style={styles.fileContainer}>
                <h2>Viewing File: {selectedFile.name}</h2>
                <iframe
                  src={`http://localhost:5000${selectedFile.path}`}
                  style={styles.iframe}
                  title="Course File"
                ></iframe>
              </div>
            ) : (
              <p>Select a file from the sidebar to view it.</p>
            )}
          </div>
        )}

        {/* Quizzes Rendering */}
        {activeTab === 'quizzes' && (
          <div>
            <h2>Quizzes</h2>
            {loadingQuizzes ? (
              <p>Loading quizzes...</p>
            ) : (
              <ul>
                {quizzes.length > 0 ? (
                  quizzes.map((quiz, index) => (
                    <li key={index}>{quiz.name}</li>
                  ))
                ) : (
                  <p>No quizzes available for this course.</p>
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
    width: '100%',
    backgroundColor: '#f1f1f1',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#2d3b55', // Darker, modern color for the sidebar
    color: '#fff', // White text for contrast
    padding: '20px',
    overflowY: 'auto',
    borderRight: '2px solid #444', // Slightly darker border for better contrast
    boxShadow: '2px 0px 10px rgba(0, 0, 0, 0.1)', // Shadow for depth
  },
  sidebarHeader: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#fff', // White for readability
    fontWeight: 'bold',
  },
  contentList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  contentItem: {
    cursor: 'pointer',
    padding: '12px',
    marginBottom: '8px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    transition: 'background-color 0.3s, transform 0.3s', // Smooth transition for hover effects
  },
  contentItemHover: {
    backgroundColor: '#4CAF50', // Green hover effect
    color: '#fff', // White text on hover
    transform: 'scale(1.05)', // Slightly enlarge the item on hover
  },
  mainContent: {
    flex: 1,
    padding: '30px',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)', // Light shadow for the main content area
    borderRadius: '8px', // Rounded corners for a more modern feel
    margin: '20px', // Adding margin around the main content for spacing
  },
  heading: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  backButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'background-color 0.3s',
  },
  backButtonHover: {
    backgroundColor: '#45a049',
  },
  tabs: {
    display: 'flex',
    margin: '20px 0',
    gap: '15px',
  },
  tabButton: {
    padding: '10px 20px',
    backgroundColor: '#f1f1f1',
    border: '1px solid #ddd',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  activeTabButton: {
    backgroundColor: '#e14177',
    color: '#fff',
    border: '1px solid #4CAF50',
  },
  iframe: {
    width: '100%',
    height: '500px',
    border: 'none',
    backgroundColor: '#fff', // Ensuring iframe background is white
  },
  fileContainer: {
    marginTop: '20px',
  },
  noContentMessage: {
    color: '#888',
    fontStyle: 'italic',
  },
  loadingText: {
    color: '#555',
    fontSize: '18px',
  },
};

export default CourseContent;
