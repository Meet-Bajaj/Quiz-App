// components/Dashboard/Dashboard.jsx
import React, { useMemo } from 'react';
import { IoTrendingUp, IoTime } from 'react-icons/io5';
import { useDashboardData } from '../../hooks/useDashboardData';
import Navbar from '../../components/NavBar';
import Card from '../Ui/Card';
import Button from '../Ui/Button';
import StatsCard from './StatsCard';
import AchievementGrid from './AchievementGrid';
import LoadingSkeleton from '../Ui/LoadingSkeleton';
import ErrorDisplay from '../Ui/ErrorBoundary';

const QuizListItem = React.memo(({ quiz, onEnroll }) => (
  <div className="flex justify-between items-center px-4 py-3 bg-zinc-900 rounded-lg hover:bg-zinc-700 transition-colors duration-200">
    <div className="flex-1">
      <h4 className="font-medium text-white">{quiz.name}</h4>
      <p className="text-sm text-gray-400 flex items-center gap-1">
        <IoTime className="text-xs" />
        {new Date(quiz.scheduledTime).toLocaleString()}
      </p>
      {quiz.difficulty && (
        <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
          quiz.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
          quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
        </span>
      )}
    </div>
    <Button 
      size="sm" 
      onClick={() => onEnroll(quiz.id)}
      className="ml-4"
    >
      Enroll
    </Button>
  </div>
));

QuizListItem.displayName = 'QuizListItem';

const Dashboard = () => {
  const { user, quizzes, loading, error } = useDashboardData();

  const stats = useMemo(() => [
    { 
      title: 'Average Score', 
      value: user?.averageScore ? `${user.averageScore}%` : '0%', 
      valueColor: 'text-green-500',
      icon: '📊'
    },
    { 
      title: 'Time Spent', 
      value: user?.timeSpent || '0h 0m', 
      valueColor: 'text-blue-500',
      icon: '⏱️'
    },
    { 
      title: 'Accuracy', 
      value: user?.accuracy ? `${user.accuracy}%` : '0%', 
      valueColor: 'text-yellow-500',
      icon: '🎯'
    }
  ], [user]);

  const sidebarStats = useMemo(() => [
    { 
      title: 'Upcoming Quizzes', 
      value: quizzes.length, 
      icon: '📅'
    },
    { 
      title: 'Completed', 
      value: user?.completedQuizzes || 0, 
      icon: '✅'
    },
    { 
      title: 'Missed', 
      value: user?.missedQuizzes || 0, 
      valueColor: 'text-red-400',
      icon: '❌'
    }
  ], [quizzes.length, user]);

  const achievements = useMemo(() => [
    { id: 1, icon: '🎓', title: 'Quiz Master', bgColor: 'blue', description: 'Completed 10+ quizzes' },
    { id: 2, icon: '🏅', title: 'Perfect Score', bgColor: 'green', description: 'Achieved 100% score' },
    { id: 3, icon: '🌟', title: 'Consistent Learner', bgColor: 'yellow', description: '7-day streak' }
  ], []);

  const handleEnrollQuiz = (quizId) => {
    // Implement enrollment logic
    console.log('Enrolling in quiz:', quizId);
  };

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen gap-2 bg-zinc-900 text-white">
        <Navbar />
        <LoadingSkeleton />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col min-h-screen gap-2 bg-zinc-900 text-white">
        <Navbar />
        <ErrorDisplay error={error} />
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen gap-2 bg-zinc-900 text-white">
      <Navbar />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 px-4 lg:px-8 py-4 flex-grow">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="text-center">
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              Welcome back, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              Ready to continue your learning journey? Check your progress below!
            </p>
          </Card>

          {/* Performance Overview */}
          <Card>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <IoTrendingUp className="text-blue-500" />
              Performance Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>
          </Card>

          {/* Achievements */}
          <Card>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              🏆 Your Achievements
            </h2>
            <AchievementGrid achievements={achievements} />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Quick Stats */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              {sidebarStats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>
          </Card>

          {/* Upcoming Quizzes */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Upcoming Quizzes</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {quizzes.length > 0 ? (quizzes.map((quiz) => (<QuizListItem key={quiz.id} quiz={quiz} 
                    onEnroll={handleEnrollQuiz}
                  />
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No upcoming quizzes 📚
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
