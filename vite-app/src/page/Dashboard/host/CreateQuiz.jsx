import * as XLSX from "xlsx";
import React, { useState, useCallback, useEffect } from "react";
import { 
  FiUpload, FiAlertCircle, FiSettings, FiCopy, 
  FiDatabase, FiFilter, FiEdit, FiTrash2, FiPlus, 
  FiSave, FiClock, FiX 
} from "react-icons/fi";

// Question Pool Management Hook
const useQuestionPool = () => {
  const [questionPool, setQuestionPool] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [units, setUnits] = useState([]);

  // Load question pool from localStorage on component mount
  useEffect(() => {
    const savedPool = localStorage.getItem('questionPool');
    if (savedPool) {
      const parsedPool = JSON.parse(savedPool);
      setQuestionPool(parsedPool);
      
      // Extract unique subjects and units
      const uniqueSubjects = [...new Set(parsedPool.map(q => q.subject))].filter(Boolean);
      const uniqueUnits = [...new Set(parsedPool.map(q => q.unit))].filter(Boolean);
      
      setSubjects(uniqueSubjects);
      setUnits(uniqueUnits);
    }
  }, []);

  // Save question pool to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('questionPool', JSON.stringify(questionPool));
  }, [questionPool]);

  const addQuestions = (questions) => {
    setQuestionPool(prev => [...prev, ...questions]);
  };

  const updateQuestion = (id, updatedQuestion) => {
    setQuestionPool(prev => 
      prev.map(q => q.id === id ? { ...q, ...updatedQuestion } : q)
    );
  };

  const deleteQuestion = (id) => {
    setQuestionPool(prev => prev.filter(q => q.id !== id));
  };

  const getQuestionsByCriteria = (criteria) => {
    let filtered = [...questionPool];
    
    if (criteria.subject) {
      filtered = filtered.filter(q => q.subject === criteria.subject);
    }
    
    if (criteria.unit) {
      filtered = filtered.filter(q => q.unit === criteria.unit);
    }
    
    if (criteria.difficulty) {
      filtered = filtered.filter(q => q.difficulty === criteria.difficulty);
    }
    
    return filtered;
  };

  const validateQuestionAvailability = (requirements) => {
    const results = requirements.map(req => {
      const available = getQuestionsByCriteria(req).length;
      return {
        ...req,
        available,
        valid: available >= req.count
      };
    });
    
    return {
      results,
      isValid: results.every(result => result.valid)
    };
  };

  return {
    questionPool,
    subjects,
    units,
    addQuestions,
    updateQuestion,
    deleteQuestion,
    getQuestionsByCriteria,
    validateQuestionAvailability
  };
};

// Quiz Timer Component
const QuizTimer = ({ duration, onTimeUp, quizId }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds
  const [isRunning, setIsRunning] = useState(false);

  // Load timer state from localStorage
  useEffect(() => {
    const savedTimer = localStorage.getItem(`quizTimer_${quizId}`);
    if (savedTimer) {
      const { startTime, duration: savedDuration } = JSON.parse(savedTimer);
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = savedDuration * 60 - elapsed;
      
      if (remaining > 0) {
        setTimeLeft(remaining);
        setIsRunning(true);
      } else {
        onTimeUp();
      }
    }
  }, [quizId, onTimeUp]);

  // Save timer state when running
  useEffect(() => {
    if (isRunning && quizId) {
      const timerData = {
        startTime: Date.now() - ((duration * 60 - timeLeft) * 1000),
        duration
      };
      localStorage.setItem(`quizTimer_${quizId}`, JSON.stringify(timerData));
    }
  }, [isRunning, timeLeft, duration, quizId]);

  // Timer countdown
  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);

  return (
    <div className="flex items-center gap-4 p-4 bg-zinc-900 rounded-lg border border-zinc-700">
      <FiClock className="text-blue-400 text-xl" />
      <div className="flex-1">
        <div className="text-white font-mono text-2xl font-bold">
          {formatTime(timeLeft)}
        </div>
        <div className="text-zinc-400 text-sm">
          Quiz Duration: {duration} minutes
        </div>
      </div>
      <div className="flex gap-2">
        {!isRunning && timeLeft > 0 && (
          <button
            onClick={startTimer}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Start
          </button>
        )}
        {isRunning && (
          <button
            onClick={pauseTimer}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Pause
          </button>
        )}
      </div>
    </div>
  );
};

// Question Pool Manager Component
const QuestionPoolManager = ({ 
  questionPool, 
  subjects, 
  units, 
  onUpdateQuestion, 
  onDeleteQuestion,
  onAddQuestions 
}) => {
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [filters, setFilters] = useState({
    subject: '',
    unit: '',
    difficulty: ''
  });
  const [showUpload, setShowUpload] = useState(false);

  const filteredQuestions = questionPool.filter(q => {
    if (filters.subject && q.subject !== filters.subject) return false;
    if (filters.unit && q.unit !== filters.unit) return false;
    if (filters.difficulty && q.difficulty !== filters.difficulty) return false;
    return true;
  });

  const handleSaveEdit = () => {
    if (editingQuestion) {
      onUpdateQuestion(editingQuestion.id, editingQuestion);
      setEditingQuestion(null);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <FiDatabase /> Question Pool ({questionPool.length} questions)
        </h3>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus /> Add Questions
        </button>
      </div>

      {showUpload && (
        <QuestionUploadSection onQuestionsUploaded={onAddQuestions} />
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block mb-2 text-zinc-300 text-sm">Subject</label>
          <select
            value={filters.subject}
            onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
            className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 focus:border-white focus:outline-none"
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 text-zinc-300 text-sm">Unit</label>
          <select
            value={filters.unit}
            onChange={(e) => setFilters(prev => ({ ...prev, unit: e.target.value }))}
            className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 focus:border-white focus:outline-none"
          >
            <option value="">All Units</option>
            {units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 text-zinc-300 text-sm">Difficulty</label>
          <select
            value={filters.difficulty}
            onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
            className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 focus:border-white focus:outline-none"
          >
            <option value="">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => setFilters({ subject: '', unit: '', difficulty: '' })}
            className="w-full px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredQuestions.map(question => (
          <div key={question.id} className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
            {editingQuestion?.id === question.id ? (
              <EditQuestionForm
                question={editingQuestion}
                onChange={setEditingQuestion}
                onSave={handleSaveEdit}
                onCancel={() => setEditingQuestion(null)}
              />
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-white font-medium mb-2">{question.question}</div>
                  <div className="flex gap-4 text-sm text-zinc-400">
                    <span>Subject: {question.subject}</span>
                    <span>Unit: {question.unit}</span>
                    <span className="capitalize">Difficulty: {question.difficulty}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setEditingQuestion(question)}
                    className="p-2 text-blue-400 hover:bg-blue-400 hover:text-white rounded transition-colors"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => onDeleteQuestion(question.id)}
                    className="p-2 text-red-400 hover:bg-red-400 hover:text-white rounded transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Edit Question Form Component
const EditQuestionForm = ({ question, onChange, onSave, onCancel }) => {
  const handleChange = (field, value) => {
    onChange({ ...question, [field]: value });
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={question.question}
        onChange={(e) => handleChange('question', e.target.value)}
        className="w-full bg-zinc-700 text-white p-2 rounded border border-zinc-600 focus:border-white focus:outline-none"
        placeholder="Question"
      />
      <div className="grid grid-cols-3 gap-2">
        <input
          type="text"
          value={question.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          className="bg-zinc-700 text-white p-2 rounded border border-zinc-600 focus:border-white focus:outline-none"
          placeholder="Subject"
        />
        <input
          type="text"
          value={question.unit}
          onChange={(e) => handleChange('unit', e.target.value)}
          className="bg-zinc-700 text-white p-2 rounded border border-zinc-600 focus:border-white focus:outline-none"
          placeholder="Unit"
        />
        <select
          value={question.difficulty}
          onChange={(e) => handleChange('difficulty', e.target.value)}
          className="bg-zinc-700 text-white p-2 rounded border border-zinc-600 focus:border-white focus:outline-none"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1 bg-zinc-600 text-white rounded hover:bg-zinc-500 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1"
        >
          <FiSave /> Save
        </button>
      </div>
    </div>
  );
};

// Question Upload Section Component
const QuestionUploadSection = ({ onQuestionsUploaded }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setErrors({});

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!jsonData || jsonData.length < 2) {
          throw new Error("No valid data found in the file");
        }

        const headers = jsonData[0];
        const rows = jsonData.slice(1).filter((row) => row.some((cell) => cell != null));

        if (rows.length === 0) {
          throw new Error("No valid data rows found");
        }

        const processedQuestions = rows.map((row, index) => {
          const obj = {};
          headers.forEach((h, i) => (obj[h] = row[i]));
          
          return {
            id: Date.now() + index,
            question: obj.question || '',
            options: [
              obj.option1,
              obj.option2,
              obj.option3,
              obj.option4,
            ].filter(Boolean),
            correct: obj.correct || '',
            difficulty: (obj.difficulty || 'easy').toLowerCase(),
            subject: obj.subject || 'General',
            unit: obj.unit || 'Default',
            createdAt: new Date().toISOString()
          };
        });

        onQuestionsUploaded(processedQuestions);
        e.target.value = ''; // Reset file input

      } catch (error) {
        setErrors({ file: error.message });
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setErrors({ file: "Error reading file" });
      setIsProcessing(false);
    };

    reader.readAsArrayBuffer(file);
  }, [onQuestionsUploaded]);

  return (
    <div className="mb-6 p-4 bg-zinc-800 rounded-lg">
      <h4 className="text-white mb-3 flex items-center gap-2">
        <FiUpload /> Upload Questions to Pool
      </h4>
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileUpload}
        className="w-full p-2 bg-zinc-700 text-white rounded-lg border border-zinc-600 focus:border-white focus:outline-none"
        disabled={isProcessing}
      />
      {errors.file && (
        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
          <FiAlertCircle /> {errors.file}
        </p>
      )}
      {isProcessing && (
        <p className="text-blue-400 text-sm mt-2">Processing file...</p>
      )}
      <p className="text-zinc-400 text-sm mt-2">
        Required columns: question, correct, difficulty, subject, unit, option1, option2, option3, option4
      </p>
    </div>
  );
};

// Main CreateQuiz Component
export default function CreateQuiz({ onQuizCreated }) {
  const {
    questionPool,
    subjects,
    units,
    addQuestions,
    updateQuestion,
    deleteQuestion,
    getQuestionsByCriteria,
    validateQuestionAvailability
  } = useQuestionPool();

  const generateQuizCode = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  const DIFFICULTY_LEVELS = {
    EASY: "easy",
    MEDIUM: "medium",
    HARD: "hard",
  };

  const [quizData, setQuizData] = useState({
    title: "",
    quizDuration: 30, // Default 30 minutes
    questionRequirements: [],
    startTime: "",
    endTime: "",
    useQuestionPool: false,
  });

  const [generatedCode, setGeneratedCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'pool'

  // Add a new question requirement
  const addQuestionRequirement = () => {
    setQuizData(prev => ({
      ...prev,
      questionRequirements: [
        ...prev.questionRequirements,
        { id: Date.now(), subject: '', unit: '', difficulty: 'easy', count: 1 }
      ]
    }));
  };

  // Update a question requirement
  const updateQuestionRequirement = (id, updates) => {
    setQuizData(prev => ({
      ...prev,
      questionRequirements: prev.questionRequirements.map(req =>
        req.id === id ? { ...req, ...updates } : req
      )
    }));
  };

  // Remove a question requirement
  const removeQuestionRequirement = (id) => {
    setQuizData(prev => ({
      ...prev,
      questionRequirements: prev.questionRequirements.filter(req => req.id !== id)
    }));
  };

  // Validate form before creating quiz
  const validateForm = () => {
    const newErrors = {};

    if (!quizData.title.trim()) newErrors.title = "Quiz title is required";
    if (!quizData.startTime) newErrors.startTime = "Start time is required";
    if (!quizData.endTime) newErrors.endTime = "End time is required";
    if (quizData.startTime && quizData.endTime && new Date(quizData.startTime) >= new Date(quizData.endTime))
      newErrors.endTime = "End time must be after start time";
    if (!quizData.quizDuration || quizData.quizDuration < 1) 
      newErrors.quizDuration = "Quiz duration must be at least 1 minute";

    if (quizData.useQuestionPool) {
      if (quizData.questionRequirements.length === 0) {
        newErrors.requirements = "Add at least one question requirement";
      } else {
        const validation = validateQuestionAvailability(quizData.questionRequirements);
        if (!validation.isValid) {
          newErrors.requirements = "Not enough questions available for some requirements";
          newErrors.requirementDetails = validation.results;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create quiz from question pool
  const createQuizFromPool = () => {
    const selectedQuestions = [];
    
    quizData.questionRequirements.forEach(requirement => {
      const availableQuestions = getQuestionsByCriteria(requirement);
      const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, requirement.count);
      selectedQuestions.push(...selected);
    });

    return selectedQuestions;
  };

  // Handle quiz creation
  const handleCreateQuiz = () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      let questions = [];
      
      if (quizData.useQuestionPool) {
        questions = createQuizFromPool();
      }

      const code = generateQuizCode();
      setGeneratedCode(code);
      setShowCode(true);

      const newQuiz = {
        id: Date.now(),
        title: quizData.title,
        questions: questions,
        duration: quizData.quizDuration,
        startTime: quizData.startTime,
        endTime: quizData.endTime,
        code,
        active: new Date(quizData.startTime) <= new Date() && new Date() <= new Date(quizData.endTime),
        participants: 0,
        avgScore: 0,
        createdAt: new Date().toISOString().split("T")[0],
        useQuestionPool: quizData.useQuestionPool,
        questionRequirements: quizData.useQuestionPool ? quizData.questionRequirements : []
      };

      onQuizCreated(newQuiz);

      // Reset form
      setQuizData({
        title: "",
        quizDuration: 30,
        questionRequirements: [],
        startTime: "",
        endTime: "",
        useQuestionPool: false,
      });

    } catch (error) {
      setErrors({ create: error.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const updateQuizData = (key, value) => {
    setQuizData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  return (
    <div className="p-4 md:p-8 flex-1 overflow-y-auto bg-zinc-950 text-white">
      <h2 className="text-3xl font-bold mb-6 text-white">Create New Quiz</h2>

      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-700 mb-6">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'create' 
              ? 'border-white text-white' 
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Create Quiz
        </button>
        <button
          onClick={() => setActiveTab('pool')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'pool' 
              ? 'border-white text-white' 
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Manage Question Pool
        </button>
      </div>

      {activeTab === 'pool' && (
        <QuestionPoolManager
          questionPool={questionPool}
          subjects={subjects}
          units={units}
          onUpdateQuestion={updateQuestion}
          onDeleteQuestion={deleteQuestion}
          onAddQuestions={addQuestions}
        />
      )}

      {activeTab === 'create' && (
        <>
          {/* Quiz Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-zinc-300">Quiz Title *</label>
              <input
                type="text"
                value={quizData.title}
                onChange={(e) => updateQuizData("title", e.target.value)}
                className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-white focus:outline-none"
                placeholder="Enter quiz title"
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-2">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-zinc-300">Quiz Duration (minutes) *</label>
              <input
                type="number"
                min="1"
                value={quizData.quizDuration}
                onChange={(e) => updateQuizData("quizDuration", parseInt(e.target.value) || 30)}
                className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-white focus:outline-none"
              />
              {errors.quizDuration && (
                <p className="text-red-400 text-sm mt-2">{errors.quizDuration}</p>
              )}
            </div>
          </div>

          {/* Time Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-zinc-300">Start Time *</label>
              <input
                type="datetime-local"
                value={quizData.startTime}
                onChange={(e) => updateQuizData("startTime", e.target.value)}
                className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-white focus:outline-none"
              />
              {errors.startTime && (
                <p className="text-red-400 text-sm mt-2">{errors.startTime}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 text-zinc-300">End Time *</label>
              <input
                type="datetime-local"
                value={quizData.endTime}
                onChange={(e) => updateQuizData("endTime", e.target.value)}
                className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-white focus:outline-none"
              />
              {errors.endTime && (
                <p className="text-red-400 text-sm mt-2">{errors.endTime}</p>
              )}
            </div>
          </div>

          {/* Question Source Selection */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-zinc-300">
              <input
                type="checkbox"
                checked={quizData.useQuestionPool}
                onChange={(e) => updateQuizData("useQuestionPool", e.target.checked)}
                className="rounded bg-zinc-800 border-zinc-700"
              />
              Use Question Pool (instead of file upload)
            </label>
          </div>

          {/* Question Pool Configuration */}
          {quizData.useQuestionPool && (
            <div className="mb-6 p-6 bg-zinc-900 border border-zinc-700 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <FiFilter /> Question Requirements
                </h3>
                <button
                  onClick={addQuestionRequirement}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiPlus /> Add Requirement
                </button>
              </div>

              {quizData.questionRequirements.map((requirement) => (
                <div key={requirement.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 p-3 bg-zinc-800 rounded-lg">
                  <select
                    value={requirement.subject}
                    onChange={(e) => updateQuestionRequirement(requirement.id, { subject: e.target.value })}
                    className="bg-zinc-700 text-white p-2 rounded border border-zinc-600 focus:border-white focus:outline-none"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>

                  <select
                    value={requirement.unit}
                    onChange={(e) => updateQuestionRequirement(requirement.id, { unit: e.target.value })}
                    className="bg-zinc-700 text-white p-2 rounded border border-zinc-600 focus:border-white focus:outline-none"
                  >
                    <option value="">All Units</option>
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>

                  <select
                    value={requirement.difficulty}
                    onChange={(e) => updateQuestionRequirement(requirement.id, { difficulty: e.target.value })}
                    className="bg-zinc-700 text-white p-2 rounded border border-zinc-600 focus:border-white focus:outline-none"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>

                  <input
                    type="number"
                    min="1"
                    value={requirement.count}
                    onChange={(e) => updateQuestionRequirement(requirement.id, { count: parseInt(e.target.value) || 1 })}
                    className="bg-zinc-700 text-white p-2 rounded border border-zinc-600 focus:border-white focus:outline-none"
                    placeholder="Count"
                  />

                  <button
                    onClick={() => removeQuestionRequirement(requirement.id)}
                    className="p-2 text-red-400 hover:bg-red-400 hover:text-white rounded transition-colors flex items-center justify-center"
                  >
                    <FiX />
                  </button>
                </div>
              ))}

              {errors.requirements && (
                <p className="text-red-400 text-sm mt-2">{errors.requirements}</p>
              )}

              {errors.requirementDetails && (
                <div className="mt-3 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                  <p className="text-red-400 font-medium mb-2">Question Availability Issues:</p>
                  {errors.requirementDetails.map((detail, index) => (
                    !detail.valid && (
                      <p key={index} className="text-red-400 text-sm">
                        {detail.subject || 'All subjects'} / {detail.unit || 'All units'} / {detail.difficulty}: 
                        Need {detail.count}, Available: {detail.available}
                      </p>
                    )
                  ))}
                </div>
              )}

              {quizData.questionRequirements.length > 0 && (
                <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                  <p className="text-blue-400 font-medium">Total Questions: {
                    quizData.questionRequirements.reduce((sum, req) => sum + req.count, 0)
                  }</p>
                </div>
              )}
            </div>
          )}

          {/* File Upload (for non-pool usage) */}
          {!quizData.useQuestionPool && (
            <QuestionUploadSection onQuestionsUploaded={addQuestions} />
          )}

          <button
            onClick={handleCreateQuiz}
            disabled={isProcessing}
            className="w-full py-4 bg-white text-zinc-900 rounded-lg font-semibold hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isProcessing ? "Creating Quiz..." : "Create Quiz"}
          </button>

          {showCode && (
            <div className="mt-6 p-6 bg-zinc-900 border border-zinc-700 rounded-xl text-center">
              <h3 className="text-white text-xl font-semibold mb-3">
                Quiz Created Successfully!
              </h3>
              <p className="text-zinc-400 mb-4">Share this code with participants:</p>
              <div className="flex items-center justify-center gap-3">
                <code className="text-2xl font-bold text-white bg-zinc-800 px-6 py-3 rounded-lg border border-zinc-700">
                  {generatedCode}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(generatedCode)}
                  className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors"
                  title="Copy code"
                >
                  <FiCopy className="text-white text-lg" />
                </button>
              </div>
              
              {/* Quiz Timer Preview */}
              <div className="mt-6">
                <QuizTimer 
                  duration={quizData.quizDuration} 
                  onTimeUp={() => console.log('Time up!')}
                  quizId={Date.now()} // In real app, use actual quiz ID
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
