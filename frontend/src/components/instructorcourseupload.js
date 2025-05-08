import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const InstructorCourseUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('content'); // Content or quizzes tab
  const [quizCount, setQuizCount] = useState(0); // Number of quiz files in the course
  const navigate = useNavigate();
  const { courseId } = useParams(); // Get the courseId from URL parameters

  // Fetch quiz files count when the component is mounted or courseId changes
  useEffect(() => {
    const fetchQuizCount = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/instructor/courses/${courseId}/quizzes/count`, {
          method: 'GET',
          credentials: 'include', // Include cookies for authentication
        });

        if (response.ok) {
          const data = await response.json();
          setQuizCount(data.quizCount || 0); // Set the quiz count (default to 0 if no count found)
        } else {
          throw new Error('Failed to fetch quiz count');
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchQuizCount();
  }, [courseId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    // Determine the API endpoint based on the active tab
    let uploadUrl = '';
    let folderPath = '';

    if (activeTab === 'content') {
      uploadUrl = `http://localhost:5000/api/instructor/courses/${courseId}/upload`;
      folderPath = `instructors/{instructorId}/${courseId}`; // Regular content upload path
    } else if (activeTab === 'quizzes') {
      uploadUrl = `http://localhost:5000/api/instructor/courses/${courseId}/quizzes/upload`;
      folderPath = `instructors/{instructorId}/${courseId}/quizzes`; // Quiz upload path
      // Add quiz number to the file name for quiz uploads
      formData.append('fileName', `quiz-${quizCount + 1}-${file.name}`);
    }

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const data = await response.json();
      setSuccess(`${activeTab === 'content' ? 'Content' : 'Quiz'} file uploaded successfully!`);
      setFile(null); // Reset file input after successful upload

      // Update quiz count if the "quizzes" tab was selected
      if (activeTab === 'quizzes') {
        setQuizCount(quizCount + 1);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.pageTitle}>Upload Files for Course {courseId}</h1>

      <div style={styles.tabs}>
        <button
          style={{ ...styles.tabButton, ...(activeTab === 'content' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button
          style={{ ...styles.tabButton, ...(activeTab === 'quizzes' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('quizzes')}
        >
          Quizzes
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <form onSubmit={handleUpload} style={styles.form}>
        <input type="file" onChange={handleFileChange} style={styles.fileInput} />
        <button style={styles.button} type="submit">
          Upload
        </button>
      </form>

      <button style={styles.button} onClick={() => navigate('/instructor/dashboard')}>
        Back to Dashboard
      </button>
    </div>
  );
};

// Styles
const styles = {
  pageContainer: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    width: '80%',
    maxWidth: '900px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    margin: 'auto',
  },
  pageTitle: {
    fontSize: '28px',
    color: '#333',
    marginBottom: '30px',
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  tabButton: {
    padding: '12px 25px',
    backgroundColor: '#f1f1f1',
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginRight: '15px',
    transition: 'background-color 0.3s ease',
  },
  activeTab: {
    backgroundColor: '#4CAF50',
    color: 'white',
    borderColor: '#4CAF50',
  },
  error: {
    color: 'red',
    marginTop: '15px',
    fontSize: '16px',
  },
  success: {
    color: 'green',
    marginTop: '15px',
    fontSize: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
  },
  fileInput: {
    marginBottom: '20px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    cursor: 'pointer',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
};

export default InstructorCourseUpload;
