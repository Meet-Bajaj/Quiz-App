import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./page/Home";
import Login from "./page/auth/Login";
import Signup from "./page/auth/Signup";
// import Dashboard from "./page/student/Dashboard/Dashboard";
// import QuizPage from "./page/student/QuizPage";
import SelectRole from "./page/auth/SelectRole";
// import Host from "./page/Dashboard/host/dashboard";
import Host from "./page/Dashboard/host/Dashboard";
// import Participant from "./page/Dashboard/participant/Dashboard";
import QuizPage from "./page/Dashboard/QuizPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/select-role" element={<SelectRole/>} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/dashboard/host" element={<Host/>} />
          {/* <Route path="/dashboard/quiz" element={<QuizPage/>} /> */}
          {/* <Route path="/dashboard/participant" element={<Participant/>} /> */}
          <Route
            path="/quiz"
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
