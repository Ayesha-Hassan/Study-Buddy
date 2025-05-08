const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Adjust the path if necessary

const app = express();

// Enable CORS for frontend-backend communication
const corsOptions = {
  origin: 'http://localhost:3000',  // Your frontend's origin (React app running on port 3000)
  methods: 'GET,POST,PUT,DELETE',  // Allowed HTTP methods
  credentials: true,               // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));  // Apply CORS middleware with custom options

// Set up session middleware
app.use(
  session({
    secret: 'your_secret_key', // Change this to a strong secret string
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,  // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000,  // Set secure cookies in production
    },
  })
);

// Parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files for uploads (e.g., profile pictures)
app.use('/uploads', express.static('uploads'));

// Mount userRoutes at the `/api` prefix
app.use('/api', userRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
