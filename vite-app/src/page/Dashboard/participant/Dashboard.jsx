import React, { useState, useEffect, useMemo } from "react";
import {
  FiAward,
  FiCalendar,
  FiBarChart2,
  FiLogOut,
  FiCheckCircle,
  FiTrendingUp,
  FiBook,
} from "react-icons/fi";
import { getDifficultyColor, getScoreColor, getRankSuffix } from "./Helper";
import mockParticipantData from "./mockdata";
import JoinQuiz from "./Joinquiz";
import MyResults from "./MyResult";
import UpcomingQuizzes from "./UpcomingQuiz";
import ProfileSettings from "./Settings";
import StatCard from "./StatsCard";
import formatDate from "./FromateDate";
import ParticipantSidebar from "./Sidebar";

function ParticipantDashboard({ data }) {
  const stats = useMemo(() => data.stats, [data.stats]);
  const recentQuizzes = useMemo(
    () => data.attemptedQuizzes.slice(0, 3),
    [data.attemptedQuizzes]
  );

  return (
    <div className="p-8 flex-1 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Welcome back, {data.profile.name}! 👋
        </h2>
        <p className="text-gray-400">
          Here's your learning progress and upcoming activities
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Quizzes"
          value={stats.totalQuizzes}
          icon={FiBook}
          gradient="from-blue-500 to-cyan-500"
          description="All available quizzes"
        />
        <StatCard
          label="Attempted"
          value={stats.attemptedQuizzes}
          icon={FiCheckCircle}
          gradient="from-green-500 to-emerald-500"
          description="Quizzes completed"
        />
        <StatCard
          label="Average Score"
          value={`${stats.averageScore}%`}
          icon={FiTrendingUp}
          gradient="from-purple-500 to-pink-500"
          description="Overall performance"
        />
        <StatCard
          label="Current Rank"
          value={`#${stats.rank}`}
          icon={FiAward}
          gradient="from-orange-500 to-red-500"
          description={`Out of ${stats.totalParticipants}`}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Performance */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-800 shadow-xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
            <FiBarChart2 className="text-blue-400 text-xl" />
            <h3 className="text-white text-lg font-semibold">
              Recent Performance
            </h3>
          </div>
          <div className="space-y-4">
            {recentQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="flex justify-between items-center py-3 border-b border-gray-800 last:border-0 hover:bg-gray-800/30 px-2 rounded transition-colors"
              >
                <div className="flex-1">
                  <span className="text-gray-200 font-medium block">
                    {quiz.title}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {formatDate(quiz.attemptedDate)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-sm font-semibold ${getScoreColor(
                      quiz.score
                    )}`}
                  >
                    {quiz.score}%
                  </span>
                  <span className="text-gray-500 text-sm">
                    Rank:{" "}
                    <span className="text-white font-semibold">
                      {quiz.rank}
                      {getRankSuffix(quiz.rank)}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Quizzes */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-800 shadow-xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
            <FiCalendar className="text-green-400 text-xl" />
            <h3 className="text-white text-lg font-semibold">
              Upcoming Quizzes
            </h3>
          </div>
          <div className="space-y-4">
            {data.upcomingQuizzes.slice(0, 3).map((quiz) => (
              <div
                key={quiz.id}
                className="flex justify-between items-center py-3 border-b border-gray-800 last:border-0 hover:bg-gray-800/30 px-2 rounded transition-colors"
              >
                <div className="flex-1">
                  <span className="text-gray-200 font-medium block">
                    {quiz.title}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {formatDate(quiz.date)} at {quiz.time}
                  </span>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${getDifficultyColor(
                    quiz.difficulty
                  )} bg-gray-800`}
                >
                  {quiz.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-800 shadow-xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
            <FiAward className="text-yellow-400 text-xl" />
            <h3 className="text-white text-lg font-semibold">Achievements</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {data.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border ${
                  achievement.earned
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-gray-800/30 border-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <p
                      className={`font-semibold text-sm ${
                        achievement.earned ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {achievement.title}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Trend */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-800 shadow-xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
            <FiTrendingUp className="text-purple-400 text-xl" />
            <h3 className="text-white text-lg font-semibold">
              Performance Trend
            </h3>
          </div>
          <div className="flex items-end justify-between h-32">
            {data.performanceHistory.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-8 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all duration-500 hover:from-purple-400 hover:to-pink-400"
                  style={{ height: `${(item.score / 100) * 80}px` }}
                ></div>
                <span className="text-gray-400 text-xs mt-2">{item.month}</span>
                <span className="text-white text-xs font-semibold mt-1">
                  {item.score}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
/* *************************************************************************************************** */
/* *************************************************************************************************** */

// Main Participant Component
export default function Participant() {
  const [data, setData] = useState(mockParticipantData);
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

  const renderPage = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your dashboard...</p>
          </div>
        </div>
      );
    }

    switch (activePage) {
      case "dashboard":
        return <ParticipantDashboard data={data} />;
      case "join":
        return <JoinQuiz data={data} />;
      case "results":
        return <MyResults data={data} />;
      case "upcoming":
        return <UpcomingQuizzes data={data} />;
      case "settings":
        return <ProfileSettings data={data} />;
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
        return <ParticipantDashboard data={data} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-black">
      <ParticipantSidebar onNavigate={setActivePage} activePage={activePage} />
      <main className="flex-1 bg-gradient-to-br from-black via-gray-950 to-black overflow-hidden">
        {renderPage()}
      </main>
    </div>
  );
}
