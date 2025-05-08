import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/signup';
import Login from './components/login';
import Landing from './components/Landing';
import AdminSignUp from './components/adminsignup';
import AdminLogin from './components/adminlogin'; 
import AdminDashboard from './components/admindashboard'; 
import AddDomainPage from './components/adddomainpage'; 
import AddCoursePage from './components/addcoursepage';
import InstructorPage from './components/instructorpage';
import InstructorSignUp from './components/instructorsignup';
import InstructorLogin from './components/instructorlogin';
import StudentDashboard from './components/studentdashboard';
import ProfilePage from './components/profilepage';
import EditProfile from './components/editprofile';
import ChangePassword from './components/changepassword';
import InstructorDashboard from './components/instructordashboard';
import MyCourses from './components/studentcourses';
import InstructorCoursesPage from './components/instructorcoursepage';
import InstructorMyCourses from './components/instructorcourses';
import InstructorApply from './components/instructorapply';
import CourseDetails from './components/coursedetails';
import ViewApplications from './components/viewapplications';
import ApplicationDetail from './components/applicationdetail';  // Import the new page for application detail
import InstructorCourseUpload from './components/instructorcourseupload';
import CourseInfo from './components/courseinfo';
import CourseContent from './components/coursecontent';
import InstructorProfile from './components/instructorprofile';

function App(){
    return (
      <Router>
          <Routes>
          <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignUp />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/domains/add" element={<AddDomainPage />} />
            <Route path="/admin/courses/add" element={<AddCoursePage />} />
            <Route path="/instructor" element={<InstructorPage />} />
            <Route path="/instructor/signup" element={<InstructorSignUp />} />
            <Route path="/instructor/login" element={<InstructorLogin />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<ProfilePage />} />
            <Route path="/student/change-password" element={<ChangePassword />} />
            <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
            <Route path="/instructor/edit-profile" element={<EditProfile />} />
            <Route path="/student/my-courses" element={<MyCourses />} />
            <Route path="/instructor/courses" element={<InstructorCoursesPage />} />
            <Route path="/instructor/my-courses" element={<InstructorMyCourses />} />
            <Route path="/instructor/apply" element={<InstructorApply />} />
            <Route path="/course/:courseId" element={<CourseDetails />} />
            <Route path="/admin/applications" element={<ViewApplications />} />
            <Route path="/admin/application/:applicationId" element={<ApplicationDetail />} /> {/* New Route */}
            <Route path="/instructor/courses/:courseId/upload" element={<InstructorCourseUpload />} />
            <Route path="/course-info/:courseId" element={<CourseInfo />} />
            <Route path="/course/:courseId/content" element={<CourseContent />} />
            <Route path="/instructor/profile" element={<InstructorProfile />} />
          </Routes>
      </Router>
    );
}

export default App;
