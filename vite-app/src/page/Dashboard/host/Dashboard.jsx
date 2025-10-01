import React, { useState, useEffect, useCallback, useMemo } from "react";
import CreateQuiz from "./CreateQuiz";
import { ListCard, StatCard } from "./Cards";
import Sidebar from "./Sidebar";
import Results from "./Result";
import Settings from "./Settings"; // ADD THIS IMPORT
import mockdata from "./mockdata";
const mockData = mockdata;
import {
  FiList,
  FiBarChart2,
  FiLogOut,
  FiUsers,
  FiActivity,
  FiCheckCircle,
} from "react-icons/fi";
import QuizList from "./QuizList";

// ... rest of the Dashboard.jsx code remains the same ...
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
// Components
function Dashboard({ data }) {
  console.log("Dashboard data:", data);
  const stats = useMemo(
    () => ({
      totalQuizzes: data.quizzes.length,
      totalParticipants: data.quizzes.reduce(
        (sum, quiz) => sum + quiz.participants,
        0
      ),
      totalQuestions: data.quizzes.reduce(
        (sum, quiz) =>
          sum +
          (Array.isArray(quiz.questions)
            ? quiz.questions.length
            : quiz.questions || 0),
        0
      ),
      totalActiveQuizzes: data.quizzes.filter((q) => q.active).length,
    }),
    [data.quizzes]
  );

  return (
    <div className="p-8 flex-1 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-gray-400">Welcome back! Here's your quiz overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Quizzes"
          value={stats.totalQuizzes}
          icon={FiList}
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          label="Total Participants"
          value={stats.totalParticipants}
          icon={FiUsers}
          gradient="from-purple-500 to-pink-500"
        />
        <StatCard
          label="Total Questions"
          value={stats.totalQuestions}
          icon={FiActivity}
          gradient="from-orange-500 to-red-500"
        />
        <StatCard
          label="Active Quizzes"
          value={stats.totalActiveQuizzes}
          icon={FiCheckCircle}
          gradient="from-green-500 to-emerald-500"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <ListCard title="Recent Quizzes" icon={FiList}>
          {data.quizzes.slice(0, 3).map((quiz) => (
            <div
              key={quiz.id}
              className="flex justify-between items-center py-3 border-b border-gray-800 last:border-0 hover:bg-gray-800/30 px-2 rounded transition-colors"
            >
              <span className="text-gray-200 font-medium">{quiz.title}</span>
              <span className="text-gray-500 text-sm">
                {formatDate(quiz.createdAt)}
              </span>
            </div>
          ))}
        </ListCard>

        <ListCard title="Active Quizzes" icon={FiActivity}>
          {data.quizzes.filter((q) => q.active).length > 0 ? (
            data.quizzes
              .filter((q) => q.active)
              .map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex justify-between items-center py-3 border-b border-gray-800 last:border-0 hover:bg-gray-800/30 px-2 rounded transition-colors"
                >
                  <span className="text-gray-200 font-medium">
                    {quiz.title}
                  </span>
                  <span className="flex items-center gap-2 text-green-400 text-xs font-semibold bg-green-400/10 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Active
                  </span>
                </div>
              ))
          ) : (
            <p className="text-gray-500 text-sm py-4 text-center">
              No active quizzes
            </p>
          )}
        </ListCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ListCard title="Average Scores" icon={FiBarChart2}>
          {data.quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="flex justify-between items-center py-3 border-b border-gray-800 last:border-0 hover:bg-gray-800/30 px-2 rounded transition-colors"
            >
              <span className="text-gray-200 font-medium">{quiz.title}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${quiz.avgScore}%` }}
                  ></div>
                </div>
                <span className="text-white text-sm font-semibold w-10 text-right">
                  {quiz.avgScore}%
                </span>
              </div>
            </div>
          ))}
        </ListCard>

        {/* <ListCard title="Notifications" icon={FiActivity}>
          {data.notifications.length > 0 ? (
            data.notifications.map((notification) => (
              <div
                key={notification.id}
                className="py-3 border-b border-gray-800 last:border-0 text-gray-300 hover:bg-gray-800/30 px-2 rounded transition-colors"
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      notification.type === "warning"
                        ? "bg-yellow-500"
                        : "bg-purple-500"
                    }`}
                  ></span>
                  <span className="text-sm">{notification.message}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm py-4 text-center">
              No new notifications
            </p>
          )}
        </ListCard> */}
      </div>
    </div>
  );
}

// ****************************************************************

// ****************************************************************
// Main Host Component
export default function Host() {
  const [data, setData] = useState(mockData);
  const [activePage, setActivePage] = useState("dashboard");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleQuizCreated = useCallback((newQuiz) => {
    console.log("New quiz created:", newQuiz);
    console.log("Previous quizzes:", data.quizzes);
    setData((prevData) => ({
      ...prevData,
      quizzes: [...prevData.quizzes, newQuiz],
      notifications: [
        {
          id: Date.now(),
          message: `New quiz "${newQuiz.title}" created`,
          type: "info",
        },
        ...prevData.notifications,
      ].slice(0, 5), // Keep only latest 5 notifications
    }));
  }, []);

  const renderPage = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      );
    }

    switch (activePage) {
      case "dashboard":
        return <Dashboard data={data} />;
      case "create":
        return <CreateQuiz onQuizCreated={handleQuizCreated} />;
      case "results":
        return <Results data={data} />;
      case "settings":
        return <Settings />;
      case "list":
        return <QuizList />;
      case "logout":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FiLogOut className="text-6xl text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Logout</h2>
              <p className="text-gray-400">Are you sure you want to logout?</p>
              <button className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Confirm Logout
              </button>
            </div>
          </div>
        );
      default:
        return <Dashboard data={data} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-black">
      <Sidebar onNavigate={setActivePage} activePage={activePage} />
      <main className="flex-1 bg-gradient-to-br from-black via-zinc-950 to-black overflow-hidden">
        {renderPage()}
      </main>
    </div>
  );
}
