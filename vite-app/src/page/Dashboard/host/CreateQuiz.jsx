import * as XLSX from "xlsx";
import React, { useState, useCallback } from "react";
import { FiUpload, FiAlertCircle, FiSettings, FiCopy } from "react-icons/fi";

export default function CreateQuiz({ onQuizCreated }) {
  const generateQuizCode = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  const validateExcelData = (data) => {
    if (!data || data.length < 2) {
      throw new Error("No valid data found in the file");
    }
    return true;
  };

  const DIFFICULTY_LEVELS = {
    EASY: "easy",
    MEDIUM: "medium",
    HARD: "hard",
  };

  const REQUIRED_COLUMNS = ["question", "correct", "difficulty"];

  const [quizData, setQuizData] = useState({
    title: "",
    questions: [],
    columnMap: {},
    easyCount: 0,
    mediumCount: 0,
    hardCount: 0,
    startTime: "",
    endTime: "",
  });
  const [availableColumns, setAvailableColumns] = useState([]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

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

        validateExcelData(jsonData);

        const headers = jsonData[0];
        const rows = jsonData.slice(1).filter((row) => row.some((cell) => cell != null));

        if (rows.length === 0) {
          throw new Error("No valid data rows found");
        }

        const processedRows = rows.map((row) => {
          const obj = {};
          headers.forEach((h, i) => (obj[h] = row[i]));
          return obj;
        });

        setQuizData((prev) => ({ ...prev, questions: processedRows }));
        setAvailableColumns(headers);
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
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!quizData.title.trim()) newErrors.title = "Quiz title is required";
    if (quizData.questions.length === 0) newErrors.questions = "Please upload questions file";
    if (!quizData.startTime) newErrors.startTime = "Start time is required";
    if (!quizData.endTime) newErrors.endTime = "End time is required";
    if (quizData.startTime && quizData.endTime && new Date(quizData.startTime) >= new Date(quizData.endTime))
      newErrors.endTime = "End time must be after start time";
    REQUIRED_COLUMNS.forEach((col) => {
      if (!quizData.columnMap[col]) newErrors.columnMap = `Please map ${col} column`;
    });

    const totalQuestions = quizData.easyCount + quizData.mediumCount + quizData.hardCount;
    if (totalQuestions === 0) newErrors.distribution = "Please select at least one question";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateQuiz = () => {
    if (!validateForm()) return;

    const mappedQuestions = quizData.questions.map((q) => ({
      question: q[quizData.columnMap.question],
      options: [
        q[quizData.columnMap.option1],
        q[quizData.columnMap.option2],
        q[quizData.columnMap.option3],
        q[quizData.columnMap.option4],
      ].filter(Boolean),
      correct: q[quizData.columnMap.correct],
      difficulty: q[quizData.columnMap.difficulty]?.toLowerCase(),
    }));

    const easyQ = mappedQuestions.filter((q) => q.difficulty === DIFFICULTY_LEVELS.EASY);
    const mediumQ = mappedQuestions.filter((q) => q.difficulty === DIFFICULTY_LEVELS.MEDIUM);
    const hardQ = mappedQuestions.filter((q) => q.difficulty === DIFFICULTY_LEVELS.HARD);

    const selectedQuestions = [
      ...easyQ.slice(0, quizData.easyCount),
      ...mediumQ.slice(0, quizData.mediumCount),
      ...hardQ.slice(0, quizData.hardCount),
    ];

    const code = generateQuizCode();
    setGeneratedCode(code);
    setShowCode(true);

    const newQuiz = {
      id: Date.now(),
      title: quizData.title,
      questions: selectedQuestions,
      easy: quizData.easyCount,
      medium: quizData.mediumCount,
      hard: quizData.hardCount,
      startTime: quizData.startTime,
      endTime: quizData.endTime,
      code,
      active:
        new Date(quizData.startTime) <= new Date() &&
        new Date() <= new Date(quizData.endTime),
      participants: 0,
      avgScore: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    onQuizCreated(newQuiz);

    setQuizData({
      title: "",
      questions: [],
      columnMap: {},
      easyCount: 0,
      mediumCount: 0,
      hardCount: 0,
      startTime: "",
      endTime: "",
    });
    setAvailableColumns([]);
    setErrors({});
  };

  const updateQuizData = (key, value) => {
    setQuizData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  return (
    <div className="p-4 md:p-8 flex-1 overflow-y-auto bg-zinc-950 text-white">
      <h2 className="text-3xl font-bold mb-6 text-white">Create New Quiz</h2>

      {/* File Upload */}
      <div className="mb-6">
        <label className="block mb-2 items-center gap-2 text-zinc-300">
          <FiUpload className="inline mr-2" /> Upload Questions (Excel)
        </label>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          className="w-full p-3 bg-zinc-900 text-white rounded-lg border border-zinc-700 focus:border-white focus:outline-none transition-colors"
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
      </div>

      {/* Column Mapping */}
      {availableColumns.length > 0 && (
        <div className="mb-6 p-6 bg-zinc-900 border border-zinc-700 rounded-xl">
          <h3 className="mb-4 font-semibold text-white flex items-center gap-2">
            <FiSettings /> Map Columns
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "question",
              "option1",
              "option2",
              "option3",
              "option4",
              "correct",
              "difficulty",
            ].map((field) => (
              <div key={field}>
                <label className="block mb-2 text-zinc-300 capitalize">
                  {field} {REQUIRED_COLUMNS.includes(field) && "*"}
                </label>
                <select
                  value={quizData.columnMap[field] || ""}
                  onChange={(e) =>
                    updateQuizData("columnMap", {
                      ...quizData.columnMap,
                      [field]: e.target.value,
                    })
                  }
                  className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-white focus:outline-none"
                >
                  <option value="">-- Select Column --</option>
                  {availableColumns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          {errors.columnMap && (
            <p className="text-red-400 text-sm mt-3">
              {errors.columnMap}
            </p>
          )}
        </div>
      )}

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>

      {/* Question Distribution */}
      {quizData.questions.length > 0 && (
        <div className="mb-6 p-6 bg-zinc-900 border border-zinc-700 rounded-xl">
          <h3 className="mb-4 font-semibold text-white">Question Distribution</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { key: "easyCount", label: "Easy" },
              { key: "mediumCount", label: "Medium" },
              { key: "hardCount", label: "Hard" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block mb-2 text-zinc-300">{label}</label>
                <input
                  type="number"
                  min="0"
                  max={
                    quizData.questions.filter(
                      (q) =>
                        q[quizData.columnMap.difficulty]?.toLowerCase() ===
                        key.replace("Count", "")
                    ).length
                  }
                  value={quizData[key]}
                  onChange={(e) =>
                    updateQuizData(
                      key,
                      Math.max(0, parseInt(e.target.value) || 0)
                    )
                  }
                  className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-white focus:outline-none"
                />
                <p className="text-zinc-500 text-sm mt-2">
                  Available:{" "}
                  {
                    quizData.questions.filter(
                      (q) =>
                        q[quizData.columnMap.difficulty]?.toLowerCase() ===
                        key.replace("Count", "")
                    ).length
                  }
                </p>
              </div>
            ))}
          </div>
          {errors.distribution && (
            <p className="text-red-400 text-sm mt-3">{errors.distribution}</p>
          )}
        </div>
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
        </div>
      )}
    </div>
  );
}
