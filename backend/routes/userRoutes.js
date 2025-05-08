const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');
const pool = require('../config/db');
const router = express.Router();
const path = require('path');

// Multer setup for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage });

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

// Register user
router.post('/signup', async (req, res) => {
    const { name, email, date_of_birth, phone_no, password } = req.body;
  
    if (!name || !email || !date_of_birth || !password) {
      return res.status(400).json({ message: 'Name, email, date of birth, and password are required' });
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      // Check if the email already exists
      const result = await pool.query('SELECT id FROM students WHERE email = $1', [email]);
      if (result.rows.length > 0) {
        return res.status(400).json({ message: 'Email is already registered' });
      }
  
      // Insert the new student record into the database
      await pool.query(
        'INSERT INTO students (name, email, date_of_birth, phone_no, password_hash) VALUES ($1, $2, $3, $4, $5)',
        [name, email, date_of_birth, phone_no, hashedPassword]
      );
  
      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      console.error('Error creating user', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const result = await pool.query('SELECT * FROM students WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      const student = result.rows[0];
      const isMatch = await bcrypt.compare(password, student.password_hash);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      // Ensure session is properly initialized before setting it
      req.session.user = { id: student.id, name: student.name };
  
      res.json({ msg: 'Login successful' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server Error' });
    }
  });
  

router.post('/logout', (req, res) => {
req.session.destroy((err) => {
    if (err) {
    return res.status(500).json({ msg: 'Failed to log out' });
    }
    res.json({ msg: 'Logged out successfully' });
});
});

router.post('/admin/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    try {
        // Check if the email already exists
        const result = await pool.query('SELECT id FROM admin WHERE email = $1', [email]);
        if (result.rows.length > 0) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new admin record into the database
        await pool.query(
            'INSERT INTO admin (name, email, password) VALUES ($1, $2, $3)',
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (err) {
        console.error('Error creating admin', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Admin login
router.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM admin WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const admin = result.rows[0];
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Admin session initialization (assuming session middleware is already set)
        req.session.user = { id: admin.id, name: admin.name, email: admin.email };
        res.json({ msg: 'Login successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Get logged-in admin details
router.get('/admin/dashboard', (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ msg: 'Not logged in' });
    }
  
    // Ensure the session contains user details
    const { id, name, email } = req.session.user;
    console.log('Logged-in admin data:', { id, name, email }); // Log data for debugging
  
    res.json({ id, name, email });
  });
  
router.post('/admin/domains', upload.single('picture'), async (req, res) => {
    const { name } = req.body;
    const picture = req.file ? req.file.path.replace(/\\/g, '/') : null;  // Normalize path

    if (!name) {
        return res.status(400).json({ msg: 'Domain name is required' });
    }

    try {
        await pool.query(
            'INSERT INTO domains (name, picture) VALUES ($1, $2)',
            [name, picture]
        );
        res.status(201).json({ msg: 'Domain added successfully' });
    } catch (err) {
        console.error('Error adding domain:', err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.get('/admin/fetch_domains', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM domains');
      const domains = result.rows.map(domain => ({
          ...domain,
          picture: domain.picture ? domain.picture.replace(/\\/g, '/') : null // Normalize path
      }));
      res.json(domains);
  } catch (err) {
      console.error('Error fetching domains:', err);
      res.status(500).json({ msg: 'Internal server error' });
  }
});
  
router.post('/admin/courses', async (req, res) => {
  const { title, creditHours, domainId } = req.body;

  if (!title || !creditHours || !domainId) {
      return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
      const result = await pool.query(
          'INSERT INTO courses (title, domain_id, credit_hours) VALUES ($1, $2, $3) RETURNING *',
          [title, domainId, creditHours]
      );

      res.status(201).json({ msg: 'Course added successfully', course: result.rows[0] });
  } catch (err) {
      console.error('Error adding course:', err);
      res.status(500).json({ msg: 'Internal server error' });
  }
});

router.get('/admin/applications', async (req, res) => {
  // Check if the user is an admin
  if (!req.session.user ) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  try {
    // Query to get all applications
    const query = `
      SELECT a.id, a.instructor_id, a.course_id, a.application_status
      FROM applications a
      where a.application_status ='pending'
      ORDER BY a.submission_date DESC;
    `;

    const result = await pool.query(query);

    res.status(200).json(result.rows);  // Send back the list of applications
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/admin/application/:applicationId', async (req, res) => {
  const { applicationId } = req.params;

  if (!req.session.user ) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  try {
    const query = `
      SELECT a.id, a.application_status, 
             i.name AS instructor_name, i.email AS instructor_email, i.phone_no AS instructor_phone,
             c.title AS course_title, c.credit_hours AS course_credit_hours
      FROM applications a
      JOIN instructors i ON a.instructor_id = i.id
      JOIN courses c ON a.course_id = c.id
      WHERE a.id = $1;
    `;

    const result = await pool.query(query, [applicationId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching application details:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// In your routes file (e.g., applicationRoutes.js or similar)
router.post('/admin/application/update/:applicationId', async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body; // "accepted" or "rejected"

  if (!req.session.user) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  if (status !== 'accepted' && status !== 'rejected') {
    return res.status(400).json({ msg: 'Invalid status' });
  }

  try {
    // Step 1: Update the application status
    const updateQuery = `
      UPDATE applications
      SET application_status = $1
      WHERE id = $2
      RETURNING instructor_id, course_id;
    `;
    const result = await pool.query(updateQuery, [status, applicationId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    const { instructor_id, course_id } = result.rows[0];

    // Step 2: If accepted, insert into instructors_per_course
    if (status === 'accepted') {
      const insertQuery = `
        INSERT INTO instructors_per_course (instructor_id, course_id)
        VALUES ($1, $2)
        ON CONFLICT (instructor_id, course_id) DO NOTHING;  -- Prevent duplicate entries
      `;
      await pool.query(insertQuery, [instructor_id, course_id]);

      // Step 3: Create a folder for the course inside the instructor's directory
      const instructorFolderPath = path.join(__dirname, '..', 'instructors', String(instructor_id));
      const courseFolderPath = path.join(instructorFolderPath, String(course_id)); // The course folder inside the instructor's folder

      // Check if the "instructors" directory exists; if not, create it
      if (!fs.existsSync(path.join(__dirname, '..', 'instructors'))) {
        fs.mkdirSync(path.join(__dirname, '..', 'instructors'));
      }

      // Check if the instructor's folder exists; if not, create it
      if (!fs.existsSync(instructorFolderPath)) {
        fs.mkdirSync(instructorFolderPath);
      }

      // Check if the course folder exists inside the instructor's folder; if not, create it
      if (!fs.existsSync(courseFolderPath)) {
        fs.mkdirSync(courseFolderPath);
      }

      // Respond with success message
      res.status(200).json({ msg: 'Application status updated and course folder created' });
    } else {
      // If application is rejected, just return the success message
      res.status(200).json({ msg: 'Application status updated' });
    }
  } catch (err) {
    console.error('Error updating application:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// Endpoint to fetch student profile info
router.get('/profile',  async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ msg: 'Not logged in' });
  }
  try {
    const studentId = req.session.user.id; // Assuming the logged-in user's info is stored in req.session.user
    const result = await pool.query('SELECT id, name, date_of_birth, email, phone_no FROM students WHERE id = $1', [studentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    res.json(result.rows[0]); // Return the student data
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// Example Node.js/Express endpoint for enrollment
router.post('/enroll', async (req, res) => {
  const { instructor_id, course_id, enrollment_date } = req.body;
  const student_id=req.session.user.id;
  console.log('student_id: ',student_id);
  try {
    // Check if the student is already enrolled in the course with the same instructor
    const checkEnrollmentQuery = `
      SELECT * FROM enrollments 
      WHERE course_id = $1 AND student_id = $2
    `;
    const result = await pool.query(checkEnrollmentQuery, [ course_id, student_id]);

    if (result.rows.length > 0) {
      // If the student is already enrolled, send a response indicating the conflict
      return res.status(400).json({ error: 'You are already enrolled in this course' });
    }

    // If not already enrolled, insert the new enrollment record
    const insertEnrollmentQuery = `
      INSERT INTO enrollments (instructor_id, course_id, student_id, enrollment_date)
      VALUES ($1, $2, $3, $4)
    `;
    await pool.query(insertEnrollmentQuery, [instructor_id, course_id, student_id, enrollment_date]);

    res.status(200).json({ message: 'Enrollment successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Enrollment failed' });
  }
});



// Endpoint to update student's profile info using POST
router.post('/edit-profile', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ msg: 'Not logged in' });
  }

  const { name, email, date_of_birth, phone_no } = req.body;
  const studentId = req.session.user.id;

  try {
    const result = await pool.query(
      'UPDATE students SET name = $1, email = $2, date_of_birth = $3, phone_no = $4 WHERE id = $5 RETURNING *',
      [name, email, date_of_birth, phone_no, studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    res.json(result.rows[0]); // Return the updated student data
  } catch (error) {
    console.error('Error updating student profile:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// Route to change the password
router.post('/student/change-password', async (req, res) => {
  // Check if the user is logged in via session
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  const { currentPassword, newPassword } = req.body;

  // Validate that both current and new passwords are provided
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Both current and new passwords are required.' });
  }

  try {
    // Get the student ID from the session
    const studentId = req.session.user.id;

    // Fetch the student's data from the database
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [studentId]);

    // Check if the student exists
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const student = result.rows[0];

    // Verify if the current password is correct
    const isPasswordMatch = await bcrypt.compare(currentPassword, student.password_hash);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    // Generate a new hashed password for the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    await pool.query('UPDATE students SET password_hash = $1 WHERE id = $2', [hashedNewPassword, studentId]);

    // Respond to the client that the password was successfully changed
    return res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

// Endpoint to get the enrolled courses for the logged-in student
router.get('/student/my-courses', async (req, res) => {
  
  const studentId = req.session.user.id;  // Assuming you're using some sort of session or JWT to store user info

  try {
    const query = `
      SELECT courses.id, courses.title, domains.name AS domain_name, domains.picture AS domain_picture
      FROM enrollments
      JOIN courses ON enrollments.course_id = courses.id
      JOIN domains ON courses.domain_id = domains.id
      WHERE enrollments.student_id = $1;
    `;
    const result = await pool.query(query, [studentId]);

    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: 'No courses found' });
    }
  } catch (err) {
    console.error('Error fetching enrolled courses:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// Get all courses with domain info - Normalize domain image paths
router.get('/courses', async (req, res) => {
  try {
      const result = await pool.query(`
          SELECT c.id, c.title, d.name as domain_name, d.picture as domain_picture
          FROM courses c
          JOIN domains d ON c.domain_id = d.id
      `);

      const courses = result.rows.map(course => ({
          ...course,
          domain_picture: course.domain_picture ? course.domain_picture.replace(/\\/g, '/') : null // Normalize path
      }));

      if (courses.length === 0) {
          return res.status(404).json({ msg: 'No courses found' });
      }

      res.json(courses);
  } catch (err) {
      console.error('Error fetching courses:', err);
      res.status(500).json({ msg: 'Internal server error' });
  }
});

router.get('/courses/:id', async (req, res) => {
  const courseId = req.params.id;

  try {
    // Query to get the course details
    const courseQuery = `
      SELECT c.*, d.picture as domain_picture, d.name as domain_name
      FROM courses c
      JOIN domains d ON c.domain_id = d.id
      WHERE c.id = $1;
    `;
    const courseResult = await pool.query(courseQuery, [courseId]);
    const course = courseResult.rows[0];

    // Query to get instructors with their average ratings
    const instructorsQuery = `
      SELECT i.id, i.name, i.email,
             COALESCE(AVG(r.rating), 0) AS avg_rating  -- Calculate average rating for each instructor
      FROM instructors i
      JOIN instructors_per_course ipc ON i.id = ipc.instructor_id
      LEFT JOIN ratings r ON i.id = r.instructor_id  -- Left join to include instructors even if they have no ratings
      WHERE ipc.course_id = $1
      GROUP BY i.id
      ORDER BY avg_rating DESC;  -- Order instructors by average rating in descending order
    `;
    const instructorsResult = await pool.query(instructorsQuery, [courseId]);
    const instructors = instructorsResult.rows;

    res.json({ course, instructors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch course details' });
  }
});
  

// Instructor signup route
router.post('/instructors/signup', async (req, res) => {
  const { name, email, phone_no, domain_id, date_of_joining, password_hash } = req.body;

  try {
    // Hash the password (assuming you're using bcrypt)
    const hashedPassword = await bcrypt.hash(password_hash, 10);

    // Insert instructor into the database
    const result = await pool.query(
      'INSERT INTO instructors (name, email, phone_no, domain_id, date_of_joining, password_hash) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, phone_no, domain_id, date_of_joining, hashedPassword]
    );

    // Get the instructor's ID
    const instructorId = result.rows[0].id;

    // Create a folder with the instructor's ID as the folder name inside the "instructors" directory
    const instructorFolderPath = path.join(__dirname, '..', 'instructors', String(instructorId));

    // Check if the "instructors" directory exists; if not, create it
    if (!fs.existsSync(path.join(__dirname, '..', 'instructors'))) {
      fs.mkdirSync(path.join(__dirname, '..', 'instructors'));
    }

    // Create the folder for the instructor
    if (!fs.existsSync(instructorFolderPath)) {
      fs.mkdirSync(instructorFolderPath);
    }

    // Respond with success message
    res.status(201).json({
      msg: 'Instructor signed up successfully',
      instructor: result.rows[0],
      folderCreated: instructorFolderPath, // Include the folder path in the response for debugging
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error signing up instructor' });
  }
});

// Route to fetch the instructor's profile
router.get('/instructors/profile', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const instructorId = req.session.user.id;

  try {
    const query = `
      SELECT i.name, i.email, i.phone_no, d.name AS domain_name, i.date_of_joining
      FROM instructors i
      JOIN domains d ON i.domain_id = d.id
      WHERE i.id = $1
    `;

    const result = await pool.query(query, [instructorId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Instructor not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});



router.post('/instructors/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
    // Fetch instructor by email
    const result = await pool.query('SELECT * FROM instructors WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const instructor = result.rows[0];

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, instructor.password_hash);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Initialize the session (store user details in the session)
    req.session.user = { 
      id: instructor.id, 
      name: instructor.name, 
      email: instructor.email 
    };

    console.log('Session after login:', req.session.user);  // Debugging log

    // Respond with a success message
    res.json({ msg: 'Login successful' });

  } catch (err) {
    console.error('Error logging in instructor:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// Route to get courses for a specific instructor
router.get('/instructor/my-coursess', async (req, res) => {
  //console.log(req.session); // Log session data for debugging
  //const instructorId = req.session.user.id;
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  const instructorId = req.session.user.id; // Assuming user is authenticated and the ID is stored in the session or token

  try {
    // Fixing query placeholder to use $1 for PostgreSQL
    const result = await pool.query(`
      SELECT c.id, c.title, d.name
      FROM courses c
      JOIN domains d ON c.domain_id=d.id
      JOIN instructors_per_course ipc ON c.id = ipc.course_id
      WHERE ipc.instructor_id = $1
    `, [instructorId]);

    // Checking if we got any courses
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: 'No courses found for this instructor' });
    }

  } catch (err) {
    console.error('Error fetching instructor courses:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

const courseFileUpload = multer({
  storage: multer.diskStorage({
      destination: (req, file, cb) => {
          const { courseId } = req.params;
          const instructorId = req.session.user.id; // Assuming instructor's ID is stored in session

          // Define the path to the course folder inside the instructor's folder
          const instructorFolderPath = path.join(__dirname, '..', 'instructors', String(instructorId));
          const courseFolderPath = path.join(instructorFolderPath, String(courseId));

          // Ensure the course folder exists, create if not
          if (!fs.existsSync(courseFolderPath)) {
              fs.mkdirSync(courseFolderPath, { recursive: true });
          }

          cb(null, courseFolderPath); // Upload to the course folder
      },
      filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + file.originalname); // Generate unique filename
      },
  }),
});

// Endpoint to handle file upload for a specific course
router.post('/instructor/courses/:courseId/upload', courseFileUpload.single('file'), async (req, res) => {
  if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
  }

  try {
      // Successfully uploaded the file
      res.status(200).json({ msg: 'File uploaded successfully', file: req.file });
  } catch (err) {
      console.error('Error uploading file:', err);
      res.status(500).json({ msg: 'Error uploading file' });
  }
});

router.post('/instructor/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          return res.status(500).json({ msg: 'Failed to log out' });
      }
      res.json({ msg: 'Logged out successfully' });
  });
});

const quizStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      const { courseId } = req.params;
      const instructorId = req.session.user.id; // Assuming the instructor's ID is available via the session

      // Directory path for quizzes
      const quizDir = path.join(__dirname, '..', 'instructors', String(instructorId), String(courseId), 'quizzes');

      // Create the quizzes directory if it doesn't exist
      if (!fs.existsSync(quizDir)) {
          fs.mkdirSync(quizDir, { recursive: true });
      }

      cb(null, quizDir);
  },
  filename: async (req, file, cb) => {
      const { courseId } = req.params;
      const instructorId = req.session.user.id;

      // Generate filename with incremented quiz number
      const quizDir = path.join(__dirname, '..', 'instructors', String(instructorId), String(courseId), 'quizzes');
      const quizFiles = fs.readdirSync(quizDir); // Read existing quiz files

      // Increment the quiz number based on existing files (e.g., quiz-1, quiz-2, ...)
      const quizNumber = quizFiles.length + 1;
      const newFileName = `quiz-${quizNumber}-${file.originalname}`;
      cb(null, newFileName);
  },
});
const quizUpload = multer({ storage: quizStorage });

/** Upload quiz files */
router.post('/instructor/courses/:courseId/quizzes/upload', quizUpload.single('file'), async (req, res) => {
  console.log(req.session.user.email);
  if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
  }

  try {
      // Successfully uploaded the quiz file
      console.log(`Quiz file uploaded: ${req.file.path}`);

      // Optionally, save the quiz file info in the database
      const { courseId } = req.params;
      const instructorId = req.session.user.id; // Instructor's ID from session

      res.status(200).json({
          msg: 'Quiz file uploaded successfully!',
          file: req.file,
      });
  } catch (error) {
      console.error('Error uploading quiz file:', error);
      res.status(500).json({ msg: 'Error uploading quiz file' });
  }
});


// Admin logout
router.post('/admin/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ msg: 'Failed to log out' });
        }
        res.json({ msg: 'Logged out successfully' });
    });
});


// Instructors' assigned courses route
router.get('/instructors/fetch-courses', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const instructorId = req.session.user.id;

  try {
    // Fetch courses for which the instructor hasn't applied or has an application that is pending or rejected
    const query = `
      SELECT c.id, c.title, c.credit_hours, d.name AS domain_name
      FROM courses c
      JOIN domains d ON c.domain_id = d.id
      WHERE NOT EXISTS (
        SELECT 1
        FROM applications a
        WHERE a.instructor_id = $1
          AND a.course_id = c.id
          AND a.application_status IN ('pending', 'accepted') 
      ) 
    `;

    const result = await pool.query(query, [instructorId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'No courses available for application' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});


// Instructor applying for a course
router.post('/instructors/apply-to-course', async (req, res) => {
  const { courseId } = req.body;

  // Ensure the instructor is logged in
  if (!req.session.user) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const instructorId = req.session.user.id;

  try {
    // Insert a new entry into the applications table with "pending" status
    const query = `
      INSERT INTO applications (instructor_id, course_id, application_status)
      VALUES ($1, $2, 'pending')
      RETURNING id;  -- Return the application id after insertion
    `;
    
    const result = await pool.query(query, [instructorId, courseId]);

    if (result.rows.length > 0) {
      // Successful insertion
      res.status(200).json({ msg: 'Applied for course successfully', applicationId: result.rows[0].id });
    } else {
      res.status(400).json({ msg: 'Failed to apply to course' });
    }
  } catch (error) {
    console.error('Error applying for course:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});


// In your instructor route file (e.g., userRoutes.js or instructorRoutes.js)

/*router.post('/instructors/apply-to-course', async (req, res) => {
  const { courseId } = req.body;
  
  // Make sure the instructor is logged in and has a valid session
  if (!req.session.user) {
    return res.status(401).json({ msg: 'You must be logged in to apply to a course' });
  }

  const instructorId = req.session.user.id;

  try {
    // Check if the instructor is already assigned to this course
    const checkQuery = 'SELECT * FROM instructors_per_course WHERE instructor_id = $1 AND course_id = $2';
    const checkResult = await pool.query(checkQuery, [instructorId, courseId]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ msg: 'You are already assigned to this course' });
    }

    // Insert the instructor-course relationship into the database
    const insertQuery = 'INSERT INTO instructors_per_course (instructor_id, course_id) VALUES ($1, $2)';
    await pool.query(insertQuery, [instructorId, courseId]);

    res.json({ msg: 'Successfully applied to the course' });
  } catch (err) {
    console.error('Error applying to course:', err);
    res.status(500).json({ msg: 'Failed to apply to course' });
  }
});
*/
// Route to fetch course details by courseId
router.get('/student/courses/:courseId', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }
  const { courseId } = req.params;
  const studentId = req.session.user.id;

  try {
    const result = await pool.query(
      `SELECT c.*, 
              d.name AS domain_name,
              i.id as instructor_id, 
              i.name AS instructor_name, 
              i.email AS instructor_email, 
              i.phone_no AS instructor_phone,
              AVG(r.rating) AS instructor_rating  -- Adding average rating for instructor
       FROM courses c 
       JOIN domains d ON c.domain_id = d.id 
       JOIN enrollments e ON e.course_id = c.id 
       JOIN instructors i ON i.id = e.instructor_id
       LEFT JOIN ratings r ON r.instructor_id = i.id AND r.course_id = c.id
       WHERE c.id = $1 and e.student_id = $2
       GROUP BY c.id, d.name, i.id`,  // GROUP BY to calculate the rating
      [courseId, studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    const courseData = result.rows.reduce((acc, row) => {
      if (!acc) {
        acc = {
          ...row,
          instructors: [],
        };
      }
      if (row.instructor_name) {
        acc.instructors.push({
          instructor_id: row.instructor_id,
          instructor_name: row.instructor_name,
          instructor_email: row.instructor_email,
          instructor_phone: row.instructor_phone,
          instructor_rating: row.instructor_rating || 'No ratings yet',  // Default if no rating exists
        });
      }
      return acc;
    }, null);

    res.json(courseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching course details' });
  }
});


router.post('/student/rate', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }
  const { instructorId, courseId, rating } = req.body;  // Get the rating data from the request body
  const studentId = req.session.user.id;  // Assuming the user is logged in and their id is in the session
  console.log('instructor id: ',instructorId);
  try {
    // Check if the student is already enrolled in this course
    const courseCheck = await pool.query(
      `SELECT 1 FROM enrollments WHERE student_id = $1 AND course_id = $2`,
      [studentId, courseId]
    );

    if (courseCheck.rowCount === 0) {
      return res.status(400).json({ msg: 'Student is not enrolled in this course.' });
    }

    // Insert or update the rating for the instructor
    const result = await pool.query(
      `INSERT INTO ratings (instructor_id, course_id, student_id, rating)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (instructor_id, course_id, student_id)  -- Handle conflict (update)
       DO UPDATE SET rating = EXCLUDED.rating`,
      [instructorId, courseId, studentId, rating]
    );

    res.json({ msg: 'Rating submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error submitting rating' });
  }
});

// Assuming you're using Express.js and PostgreSQL with 'pool' for database connection

router.get('/enrollments/instructor', async (req, res) => {
  const {  course_id } = req.query; // Get student_id and course_id from query parameters
  const student_id=req.session.user.id;
  try {
    // Query the database to get the instructor_id for the given student and course
    const query = `
      SELECT instructor_id FROM enrollments 
      WHERE student_id = $1 AND course_id = $2
    `;
    const result = await pool.query(query, [student_id, course_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Enrollment not found for this student and course' });
    }

    const instructorId = result.rows[0].instructor_id;
    res.status(200).json({ instructor_id: instructorId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch instructor ID' });
  }
});


router.use('/instructors', express.static(path.join(__dirname, 'instructors')));

// Example route for course content
router.get('/instructors/:instructorId/courses/:courseId/content', (req, res) => {
  const { instructorId, courseId } = req.params;
  const folderPath = path.join(__dirname,'..', 'instructors', instructorId, courseId);

  console.log("Resolved folder path:", folderPath);  // Debugging line

  // Check if folder exists
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading folder:", err);
      return res.status(500).json({ error: 'Failed to read course content folder' });
    }

    // Generate file paths accessible via the URL
    const fileData = files.map(file => ({
      name: file,
      path: `/instructors/${instructorId}/${courseId}/${file}`  // Correct URL to access the file
    }));

    res.json({ files: fileData });
  });
});


router.get('/instructor/:instructorId/courses/:courseId/quizzes', (req, res) => {
  const { instructorId, courseId } = req.params;
  console.log('I_id: ',instructorId, 'C_id: ',courseId);
  const folderPath = path.join(__dirname,'..', 'instructors', instructorId, courseId, 'quizzes');
 console.log(folderPath);
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read course content folder' });
    }

    // Return file data
    const fileData = files.map(file => ({
      name: file,
      path: `uploads/instructors/${instructorId}/${courseId}/${file}`
    }));
    
    res.json({ files: fileData });
  });
});

module.exports = router;
