import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./page/Home";
import Login from "./page/auth/Login";
import Signup from "./page/auth/Signup";
import HostDashboard from "./page/Dashboard/host/Dashboard";
import Participant from "./page/Dashboard/participant/Dashboard";
import QuizPage from "./page/Dashboard/QuizPage";
import { Navigate } from "react-router-dom";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  // Replace this with your actual authentication logic
  const isAuthenticated = localStorage.getItem("token");
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children; 
};

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard/host" element={
            // <ProtectedRoute>
            // </ProtectedRoute>
              <HostDashboard/>
          } />
          <Route path="/dashboard/participant" element={
            // <ProtectedRoute>
              <Participant/>
            // </ProtectedRoute>
          } />
          <Route
            path="/quiz"
            element={
              // <ProtectedRoute>
                <QuizPage
                  User={{
                    name: "John Smith",
                    user_Id: 123456,
                    Program: "B.Tech", 
                  }}
                  Quiz={{ course: "History", Id: "ABC123" }}
                />
              // </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
