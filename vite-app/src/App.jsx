import Home from "./page/Home";
import Login from "./page/auth/Login";
import Signup from "./page/auth/Signup";
import Dashboard from "./page/student/Dashboard/Dashboard";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuizPage from "./page/student/QuizPage";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="Quiz"
            element={
              <QuizPage
                User={{
                  name: "John Smith",
                  user_Id: 123456,
                  Program: "B.Tech",
                }}
                Quiz={{ course: "History", Id: "ABC123" }}
              />
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
