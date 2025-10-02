import React, { useState, useMemo } from "react";
import { FiSearch, FiEye, FiDownload, FiBarChart2 } from "react-icons/fi";
import formatDate from "./FromateDate";
import { getScoreColor, getRankSuffix } from "./Helper";

export default function MyResults({ data }) {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredQuizzes = useMemo(() => {
    return data.attemptedQuizzes.filter((quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.host.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "published" && quiz.resultPublished) ||
        (filter === "pending" && !quiz.resultPublished);
      return matchesSearch && matchesFilter;
    });
  }, [data.attemptedQuizzes, searchTerm, filter]);

  const downloadResult = (quiz) => {
    // Simulate download
    const element = document.createElement("a");
    const file = new Blob(
      [
        `Quiz Result: ${quiz.title}\nScore: ${quiz.score}%\nRank: ${quiz.rank}\nDate: ${quiz.attemptedDate}`,
      ],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `quiz_result_${quiz.title.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">My Results</h2>
        <p className="text-gray-400 text-sm sm:text-base">
          Track your quiz performance and progress
        </p>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search quizzes or hosts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
            />
          </div>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
        >
          <option value="all">All Results</option>
          <option value="published">Published</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Results Grid */}
      <div className="grid gap-4 sm:gap-6">
        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-zinc-900 rounded-xl p-4 sm:p-6 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 shadow-xl"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                      {quiz.title}
                    </h3>
                    <p className="text-gray-400 text-sm">Hosted by {quiz.host}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      quiz.resultPublished
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    } self-start`}
                  >
                    {quiz.resultPublished ? "Published" : "Pending"}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Date Attempted</p>
                    <p className="text-white font-semibold text-sm sm:text-base">
                      {formatDate(quiz.attemptedDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Score</p>
                    <p className={`font-semibold text-sm sm:text-base ${getScoreColor(quiz.score)}`}>
                      {quiz.score}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Rank</p>
                    <p className="text-white font-semibold text-sm sm:text-base">
                      {quiz.rank}
                      {getRankSuffix(quiz.rank)} of {quiz.totalParticipants}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Time Taken</p>
                    <p className="text-white font-semibold text-sm sm:text-base">{quiz.timeTaken}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-gray-400 text-xs mb-1">
                    <span>
                      Correct: {quiz.correctAnswers}/{quiz.totalQuestions}
                    </span>
                    <span>
                      {Math.round(
                        (quiz.correctAnswers / quiz.totalQuestions) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(quiz.correctAnswers / quiz.totalQuestions) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex lg:flex-col gap-2">
                <button
                  onClick={() => setSelectedQuiz(quiz)}
                  className="px-3 sm:px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center gap-2 text-sm"
                >
                  <FiEye className="text-sm" />
                  Details
                </button>
                <button
                  onClick={() => downloadResult(quiz)}
                  className="px-3 sm:px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center gap-2 text-sm"
                >
                  <FiDownload className="text-sm" />
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <FiBarChart2 className="text-4xl sm:text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-base sm:text-lg">
            No results found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
}
