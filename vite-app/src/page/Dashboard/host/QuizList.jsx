import React, { useState, useEffect } from "react";
import { 
  FiList, FiPlay, FiPause, FiEdit, FiTrash2, 
  FiUsers, FiBarChart2, FiClock, FiCalendar,
  FiSearch, FiFilter, FiEye, FiCopy,
  FiChevronDown, FiChevronUp, FiCheck, FiX
} from "react-icons/fi";

// Mock data for quizzes
const MOCK_QUIZZES = [
  {
    id: 1,
    title: "JavaScript Fundamentals Assessment",
    code: "JSFUND",
    questions: [
      {
        id: 1,
        question: "What is the output of console.log(typeof null)?",
        options: ["null", "object", "undefined", "string"],
        correct: "object",
        difficulty: "easy",
        subject: "JavaScript",
        unit: "Data Types"
      },
      {
        id: 2,
        question: "Which method creates a new array with results of calling a function on every element?",
        options: ["forEach()", "map()", "reduce()", "filter()"],
        correct: "map()",
        difficulty: "easy",
        subject: "JavaScript",
        unit: "Array Methods"
      },
      {
        id: 3,
        question: "What is a closure in JavaScript?",
        options: [
          "A function that has access to its outer function's scope",
          "A way to close browser tabs",
          "A method to end JavaScript execution",
          "A type of variable declaration"
        ],
        correct: "A function that has access to its outer function's scope",
        difficulty: "medium",
        subject: "JavaScript",
        unit: "Functions"
      },
      {
        id: 4,
        question: "What does the 'this' keyword refer to in arrow functions?",
        options: [
          "The global object",
          "The function itself",
          "The lexical context where it was defined",
          "Undefined"
        ],
        correct: "The lexical context where it was defined",
        difficulty: "hard",
        subject: "JavaScript",
        unit: "Functions"
      },
      {
        id: 5,
        question: "Which of these is NOT a JavaScript framework?",
        options: ["React", "Vue", "Angular", "Django"],
        correct: "Django",
        difficulty: "easy",
        subject: "JavaScript",
        unit: "Frameworks"
      }
    ],
    duration: 45,
    startTime: "2024-01-15T10:00:00",
    endTime: "2024-01-15T23:59:00",
    active: true,
    participants: 24,
    avgScore: 78.5,
    createdAt: "2024-01-10",
    useQuestionPool: true,
    questionRequirements: [
      { subject: "JavaScript", unit: "Data Types", difficulty: "easy", count: 1 },
      { subject: "JavaScript", unit: "Array Methods", difficulty: "easy", count: 1 },
      { subject: "JavaScript", unit: "Functions", difficulty: "medium", count: 2 },
      { subject: "JavaScript", unit: "Frameworks", difficulty: "easy", count: 1 }
    ]
  },
  {
    id: 2,
    title: "React Advanced Concepts",
    code: "REACTADV",
    questions: [
      {
        id: 6,
        question: "What is the purpose of React keys?",
        options: [
          "To style components",
          "To identify elements in lists for efficient updates",
          "To encrypt component data",
          "To define routing paths"
        ],
        correct: "To identify elements in lists for efficient updates",
        difficulty: "medium",
        subject: "React",
        unit: "Lists & Keys"
      },
      {
        id: 7,
        question: "Which hook is used for side effects in functional components?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correct: "useEffect",
        difficulty: "easy",
        subject: "React",
        unit: "Hooks"
      },
      {
        id: 8,
        question: "What is the virtual DOM in React?",
        options: [
          "A lightweight copy of the real DOM",
          "A security feature",
          "A database for React components",
          "A testing environment"
        ],
        correct: "A lightweight copy of the real DOM",
        difficulty: "medium",
        subject: "React",
        unit: "Core Concepts"
      },
      {
        id: 9,
        question: "How do you optimize performance in React?",
        options: [
          "Using React.memo and useMemo",
          "Using inline styles everywhere",
          "Creating large components",
          "Avoiding functional components"
        ],
        correct: "Using React.memo and useMemo",
        difficulty: "hard",
        subject: "React",
        unit: "Performance"
      }
    ],
    duration: 30,
    startTime: "2024-01-20T09:00:00",
    endTime: "2024-01-25T18:00:00",
    active: true,
    participants: 15,
    avgScore: 82.3,
    createdAt: "2024-01-18",
    useQuestionPool: false
  },
  {
    id: 3,
    title: "Python Programming Basics",
    code: "PYTHON101",
    questions: [
      {
        id: 10,
        question: "Which data type is mutable in Python?",
        options: ["tuple", "string", "list", "int"],
        correct: "list",
        difficulty: "easy",
        subject: "Python",
        unit: "Data Types"
      },
      {
        id: 11,
        question: "What is the output of 'hello'[1:4]?",
        options: ["hell", "ello", "ell", "hel"],
        correct: "ell",
        difficulty: "medium",
        subject: "Python",
        unit: "Strings"
      },
      {
        id: 12,
        question: "Which keyword is used to define a function in Python?",
        options: ["function", "def", "define", "func"],
        correct: "def",
        difficulty: "easy",
        subject: "Python",
        unit: "Functions"
      }
    ],
    duration: 25,
    startTime: "2024-01-05T00:00:00",
    endTime: "2024-01-10T23:59:00",
    active: false,
    participants: 32,
    avgScore: 65.8,
    createdAt: "2024-01-01",
    useQuestionPool: true,
    questionRequirements: [
      { subject: "Python", unit: "Data Types", difficulty: "easy", count: 1 },
      { subject: "Python", unit: "Strings", difficulty: "medium", count: 1 },
      { subject: "Python", unit: "Functions", difficulty: "easy", count: 1 }
    ]
  },
  {
    id: 4,
    title: "Database Design Principles",
    code: "DBDESIGN",
    questions: [
      {
        id: 13,
        question: "What is the purpose of database normalization?",
        options: [
          "To reduce data redundancy",
          "To increase storage space",
          "To make queries slower",
          "To duplicate data"
        ],
        correct: "To reduce data redundancy",
        difficulty: "medium",
        subject: "Database",
        unit: "Normalization"
      },
      {
        id: 14,
        question: "Which SQL command is used to modify existing data?",
        options: ["UPDATE", "MODIFY", "ALTER", "CHANGE"],
        correct: "UPDATE",
        difficulty: "easy",
        subject: "Database",
        unit: "SQL Commands"
      },
      {
        id: 15,
        question: "What is a foreign key?",
        options: [
          "A key that uniquely identifies a record",
          "A key that references a primary key in another table",
          "A key that is always null",
          "A key used for encryption"
        ],
        correct: "A key that references a primary key in another table",
        difficulty: "medium",
        subject: "Database",
        unit: "Keys"
      },
      {
        id: 16,
        question: "Which normal form eliminates transitive dependencies?",
        options: ["1NF", "2NF", "3NF", "BCNF"],
        correct: "3NF",
        difficulty: "hard",
        subject: "Database",
        unit: "Normalization"
      }
    ],
    duration: 60,
    startTime: "2024-02-01T08:00:00",
    endTime: "2024-02-15T20:00:00",
    active: true,
    participants: 8,
    avgScore: 71.2,
    createdAt: "2024-01-28",
    useQuestionPool: false
  },
  {
    id: 5,
    title: "Web Security Fundamentals",
    code: "WEBSEC",
    questions: [
      {
        id: 17,
        question: "What is XSS attack?",
        options: [
          "Cross-Site Scripting",
          "Extra Strong Security",
          "XML System Service",
          "Extended Server Session"
        ],
        correct: "Cross-Site Scripting",
        difficulty: "medium",
        subject: "Security",
        unit: "Web Attacks"
      },
      {
        id: 18,
        question: "Which HTTP header prevents XSS attacks?",
        options: [
          "Content-Security-Policy",
          "X-Frame-Options",
          "Strict-Transport-Security",
          "All of the above"
        ],
        correct: "All of the above",
        difficulty: "hard",
        subject: "Security",
        unit: "Prevention"
      }
    ],
    duration: 20,
    startTime: "2024-01-25T12:00:00",
    endTime: "2024-02-05T12:00:00",
    active: true,
    participants: 12,
    avgScore: 88.9,
    createdAt: "2024-01-22",
    useQuestionPool: true,
    questionRequirements: [
      { subject: "Security", unit: "Web Attacks", difficulty: "medium", count: 1 },
      { subject: "Security", unit: "Prevention", difficulty: "hard", count: 1 }
    ]
  }
];

// Mock data for question pool
const MOCK_QUESTION_POOL = [
  {
    id: 1,
    question: "What is the output of console.log(typeof null)?",
    options: ["null", "object", "undefined", "string"],
    correct: "object",
    difficulty: "easy",
    subject: "JavaScript",
    unit: "Data Types",
    createdAt: "2024-01-10T08:30:00"
  },
  {
    id: 2,
    question: "Which method creates a new array with results of calling a function on every element?",
    options: ["forEach()", "map()", "reduce()", "filter()"],
    correct: "map()",
    difficulty: "easy",
    subject: "JavaScript",
    unit: "Array Methods",
    createdAt: "2024-01-10T08:35:00"
  },
  {
    id: 3,
    question: "What is a closure in JavaScript?",
    options: [
      "A function that has access to its outer function's scope",
      "A way to close browser tabs",
      "A method to end JavaScript execution",
      "A type of variable declaration"
    ],
    correct: "A function that has access to its outer function's scope",
    difficulty: "medium",
    subject: "JavaScript",
    unit: "Functions",
    createdAt: "2024-01-10T09:15:00"
  },
  {
    id: 4,
    question: "What does the 'this' keyword refer to in arrow functions?",
    options: [
      "The global object",
      "The function itself",
      "The lexical context where it was defined",
      "Undefined"
    ],
    correct: "The lexical context where it was defined",
    difficulty: "hard",
    subject: "JavaScript",
    unit: "Functions",
    createdAt: "2024-01-10T10:20:00"
  },
  {
    id: 5,
    question: "Which of these is NOT a JavaScript framework?",
    options: ["React", "Vue", "Angular", "Django"],
    correct: "Django",
    difficulty: "easy",
    subject: "JavaScript",
    unit: "Frameworks",
    createdAt: "2024-01-10T11:05:00"
  },
  {
    id: 6,
    question: "What is the purpose of React keys?",
    options: [
      "To style components",
      "To identify elements in lists for efficient updates",
      "To encrypt component data",
      "To define routing paths"
    ],
    correct: "To identify elements in lists for efficient updates",
    difficulty: "medium",
    subject: "React",
    unit: "Lists & Keys",
    createdAt: "2024-01-11T14:30:00"
  },
  {
    id: 7,
    question: "Which hook is used for side effects in functional components?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    correct: "useEffect",
    difficulty: "easy",
    subject: "React",
    unit: "Hooks",
    createdAt: "2024-01-11T15:45:00"
  },
  {
    id: 8,
    question: "What is the virtual DOM in React?",
    options: [
      "A lightweight copy of the real DOM",
      "A security feature",
      "A database for React components",
      "A testing environment"
    ],
    correct: "A lightweight copy of the real DOM",
    difficulty: "medium",
    subject: "React",
    unit: "Core Concepts",
    createdAt: "2024-01-12T09:20:00"
  },
  {
    id: 9,
    question: "How do you optimize performance in React?",
    options: [
      "Using React.memo and useMemo",
      "Using inline styles everywhere",
      "Creating large components",
      "Avoiding functional components"
    ],
    correct: "Using React.memo and useMemo",
    difficulty: "hard",
    subject: "React",
    unit: "Performance",
    createdAt: "2024-01-12T11:10:00"
  },
  {
    id: 10,
    question: "Which data type is mutable in Python?",
    options: ["tuple", "string", "list", "int"],
    correct: "list",
    difficulty: "easy",
    subject: "Python",
    unit: "Data Types",
    createdAt: "2024-01-13T13:25:00"
  }
];

// Quiz Card Component
const QuizCard = ({ quiz, onEdit, onDelete, onView, onToggleActive, onCopyCode }) => {
  const [expanded, setExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getStatusBadge = (quiz) => {
    const now = new Date();
    const start = new Date(quiz.startTime);
    const end = new Date(quiz.endTime);
    
    if (!quiz.active) return { text: "Inactive", color: "bg-gray-500" };
    if (now < start) return { text: "Scheduled", color: "bg-blue-500" };
    if (now > end) return { text: "Expired", color: "bg-red-500" };
    return { text: "Active", color: "bg-green-500" };
  };

  const getDifficultyCounts = (questions) => {
    const counts = { easy: 0, medium: 0, hard: 0 };
    questions?.forEach(q => {
      if (counts[q.difficulty] !== undefined) {
        counts[q.difficulty]++;
      }
    });
    return counts;
  };

  const status = getStatusBadge(quiz);
  const difficultyCounts = getDifficultyCounts(quiz.questions);

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 mb-4 hover:border-zinc-600 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-white font-semibold text-lg">{quiz.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
              {status.text}
            </span>
            {quiz.useQuestionPool && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500">
                From Pool
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 mb-3">
            <div className="flex items-center gap-1">
              <FiCalendar className="text-zinc-500" />
              <span>Created: {new Date(quiz.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiClock className="text-zinc-500" />
              <span>{quiz.duration} mins</span>
            </div>
            <div className="flex items-center gap-1">
              <FiUsers className="text-zinc-500" />
              <span>{quiz.participants} participants</span>
            </div>
            <div className="flex items-center gap-1">
              <FiBarChart2 className="text-zinc-500" />
              <span>Avg: {quiz.avgScore}%</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <code className="bg-zinc-800 px-3 py-1 rounded-lg text-white font-mono border border-zinc-700">
                {quiz.code}
              </code>
              <button
                onClick={() => onCopyCode(quiz.code)}
                className="p-1 text-zinc-400 hover:text-white transition-colors"
                title="Copy code"
              >
                <FiCopy size={14} />
              </button>
            </div>
            
            <div className="flex gap-1">
              <span className="text-green-400 text-sm">E: {difficultyCounts.easy}</span>
              <span className="text-yellow-400 text-sm">M: {difficultyCounts.medium}</span>
              <span className="text-red-400 text-sm">H: {difficultyCounts.hard}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          
          <button
            onClick={() => onView(quiz)}
            className="p-2 text-blue-400 hover:text-white hover:bg-blue-600 rounded-lg transition-colors"
            title="View Details"
          >
            <FiEye />
          </button>
          
          <button
            onClick={() => onEdit(quiz)}
            className="p-2 text-yellow-400 hover:text-white hover:bg-yellow-600 rounded-lg transition-colors"
            title="Edit Quiz"
          >
            <FiEdit />
          </button>
          
          <button
            onClick={() => onToggleActive(quiz)}
            className={`p-2 rounded-lg transition-colors ${
              quiz.active 
                ? "text-green-400 hover:text-white hover:bg-green-600" 
                : "text-zinc-400 hover:text-white hover:bg-zinc-600"
            }`}
            title={quiz.active ? "Deactivate" : "Activate"}
          >
            {quiz.active ? <FiPause /> : <FiPlay />}
          </button>
          
          <button
            onClick={() => setShowConfirm(true)}
            className="p-2 text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
            title="Delete Quiz"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-zinc-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-white font-medium mb-2">Time Schedule</h4>
              <div className="text-sm text-zinc-400 space-y-1">
                <div>Starts: {new Date(quiz.startTime).toLocaleString()}</div>
                <div>Ends: {new Date(quiz.endTime).toLocaleString()}</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-2">Question Sources</h4>
              {quiz.useQuestionPool ? (
                <div className="text-sm text-zinc-400">
                  <div>From Question Pool:</div>
                  <div className="mt-1 space-y-1">
                    {quiz.questionRequirements?.map((req, index) => (
                      <div key={index} className="text-xs">
                        {req.subject} / {req.unit} / {req.difficulty} × {req.count}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-zinc-400">Uploaded via Excel file</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 max-w-md w-full mx-4">
            <h3 className="text-white font-semibold mb-2">Delete Quiz</h3>
            <p className="text-zinc-400 mb-4">
              Are you sure you want to delete "{quiz.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(quiz.id);
                  setShowConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main QuizList Component
export default function QuizList({ onEditQuiz, onCreateQuiz }) {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created");
  const [sortOrder, setSortOrder] = useState("desc");

  // Load quizzes from localStorage or use mock data
  useEffect(() => {
    const savedQuizzes = localStorage.getItem('quizzes');
    if (savedQuizzes) {
      setQuizzes(JSON.parse(savedQuizzes));
    } else {
      setQuizzes(MOCK_QUIZZES);
      localStorage.setItem('quizzes', JSON.stringify(MOCK_QUIZZES));
    }
  }, []);

  // Initialize question pool if not exists
  useEffect(() => {
    const savedPool = localStorage.getItem('questionPool');
    if (!savedPool) {
      localStorage.setItem('questionPool', JSON.stringify(MOCK_QUESTION_POOL));
    }
  }, []);

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const now = new Date();
    const start = new Date(quiz.startTime);
    const end = new Date(quiz.endTime);
    
    let matchesStatus = true;
    if (statusFilter === "active") {
      matchesStatus = quiz.active && now >= start && now <= end;
    } else if (statusFilter === "scheduled") {
      matchesStatus = quiz.active && now < start;
    } else if (statusFilter === "expired") {
      matchesStatus = now > end;
    } else if (statusFilter === "inactive") {
      matchesStatus = !quiz.active;
    }
    
    return matchesSearch && matchesStatus;
  });

  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "participants":
        aValue = a.participants;
        bValue = b.participants;
        break;
      case "score":
        aValue = a.avgScore;
        bValue = b.avgScore;
        break;
      case "created":
      default:
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
    }
    
    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleDeleteQuiz = (quizId) => {
    const updatedQuizzes = quizzes.filter(quiz => quiz.id !== quizId);
    setQuizzes(updatedQuizzes);
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
  };

  const handleToggleActive = (quiz) => {
    const updatedQuizzes = quizzes.map(q =>
      q.id === quiz.id ? { ...q, active: !q.active } : q
    );
    setQuizzes(updatedQuizzes);
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  const handleViewQuiz = (quiz) => {
    // Navigate to quiz details or show modal
    console.log("View quiz:", quiz);
  };

  const stats = {
    total: quizzes.length,
    active: quizzes.filter(q => q.active && new Date() >= new Date(q.startTime) && new Date() <= new Date(q.endTime)).length,
    participants: quizzes.reduce((sum, q) => sum + q.participants, 0),
    avgScore: quizzes.length > 0 ? (quizzes.reduce((sum, q) => sum + q.avgScore, 0) / quizzes.length).toFixed(1) : 0
  };

  return (
    <div className="p-4 md:p-8 flex-1 overflow-y-auto bg-zinc-950 text-white">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FiList className="text-2xl" /> Quiz List
          </h2>
          <p className="text-zinc-400">Manage and view all your created quizzes</p>
        </div>
        
        <button
          onClick={onCreateQuiz}
          className="mt-4 lg:mt-0 px-6 py-3 bg-white text-zinc-900 rounded-lg font-semibold hover:bg-zinc-200 transition-all"
        >
          Create New Quiz
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-700">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-zinc-400 text-sm">Total Quizzes</div>
        </div>
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-700">
          <div className="text-2xl font-bold text-green-400">{stats.active}</div>
          <div className="text-zinc-400 text-sm">Active Now</div>
        </div>
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-700">
          <div className="text-2xl font-bold text-blue-400">{stats.participants}</div>
          <div className="text-zinc-400 text-sm">Total Participants</div>
        </div>
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-700">
          <div className="text-2xl font-bold text-yellow-400">{stats.avgScore}%</div>
          <div className="text-zinc-400 text-sm">Average Score</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search quizzes by title or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-white focus:outline-none"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-white focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active Now</option>
            <option value="scheduled">Scheduled</option>
            <option value="expired">Expired</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-white focus:outline-none"
            >
              <option value="created">Sort by Created</option>
              <option value="title">Sort by Title</option>
              <option value="participants">Sort by Participants</option>
              <option value="score">Sort by Average Score</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-4 bg-zinc-800 text-white rounded-lg border border-zinc-700 hover:bg-zinc-700 transition-colors"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
      </div>

      {/* Quizzes List */}
      <div>
        {sortedQuizzes.length === 0 ? (
          <div className="text-center py-12">
            <FiList className="text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No quizzes found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filters" 
                : "Create your first quiz to get started"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <button
                onClick={onCreateQuiz}
                className="px-6 py-3 bg-white text-zinc-900 rounded-lg font-semibold hover:bg-zinc-200 transition-all"
              >
                Create Your First Quiz
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="text-zinc-400 text-sm mb-4">
              Showing {sortedQuizzes.length} of {quizzes.length} quizzes
            </div>
            {sortedQuizzes.map(quiz => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onEdit={onEditQuiz}
                onDelete={handleDeleteQuiz}
                onView={handleViewQuiz}
                onToggleActive={handleToggleActive}
                onCopyCode={handleCopyCode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
