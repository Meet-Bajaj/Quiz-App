import React, { useState, useMemo } from "react";
import { FiCalendar, FiClock } from "react-icons/fi";
import formatDate from "./FromateDate";
import { getDifficultyColor } from "./Helper";

export default function UpcomingQuizzes({ data }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const allCategories = data.upcomingQuizzes.map((quiz) => quiz.category);
    return ["all", ...new Set(allCategories)];
  }, [data.upcomingQuizzes]);

  const filteredQuizzes = useMemo(() => {
    if (selectedCategory === "all") return data.upcomingQuizzes;
    return data.upcomingQuizzes.filter(
      (quiz) => quiz.category === selectedCategory
    );
  }, [data.upcomingQuizzes, selectedCategory]);

  const joinQuiz = (quizId) => {
    // Simulate joining quiz
    alert(
      `Joining quiz ID: ${quizId}. This would redirect to the quiz interface.`
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Upcoming Quizzes</h2>
        <p className="text-gray-400 text-sm sm:text-base">Browse and join upcoming quizzes</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 sm:px-4 py-2 rounded-lg transition-all text-xs sm:text-sm ${
              selectedCategory === category
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white"
            }`}
          >
            {category === "all" ? "All Categories" : category}
          </button>
        ))}
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-zinc-900 rounded-xl p-4 sm:p-6 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 mr-2">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 line-clamp-2">
                  {quiz.title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm">By {quiz.host}</p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold flex-shrink-0 ${getDifficultyColor(
                  quiz.difficulty
                )} bg-zinc-800`}
              >
                {quiz.difficulty}
              </span>
            </div>

            <div className="space-y-2 sm:space-y-3 mb-4">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-400">Date & Time</span>
                <span className="text-white text-right">
                  {formatDate(quiz.date)}<br className="sm:hidden" /> at {quiz.time}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-400">Duration</span>
                <span className="text-white">{quiz.duration} mins</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-400">Questions</span>
                <span className="text-white">{quiz.totalQuestions}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-400">Category</span>
                <span className="text-blue-400">{quiz.category}</span>
              </div>
            </div>

            <button
              onClick={() => joinQuiz(quiz.id)}
              className="w-full py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <FiCalendar className="text-sm" />
              Join Quiz
            </button>

            {/* Countdown Timer */}
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-2 text-orange-400 text-xs sm:text-sm">
                <FiClock className="text-sm" />
                <span>Starts in 2 days</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <FiCalendar className="text-4xl sm:text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-base sm:text-lg">
            No upcoming quizzes in this category
          </p>
        </div>
      )}
    </div>
  );
}
