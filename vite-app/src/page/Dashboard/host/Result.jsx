import * as XLSX from "xlsx";
import React, { useState, useCallback, useMemo } from "react";
import { FiDownload, FiPrinter, FiInfo, FiEye, FiEyeOff, FiBarChart2 } from "react-icons/fi";

export default function Results({ data }) {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [participants, setParticipants] = useState(data.participants);
  const [filter, setFilter] = useState("all");

  const quizParticipants = useMemo(() => {
    if (!selectedQuiz) return [];
    
    let filtered = participants.filter(p => p.quizId === selectedQuiz.id);
    
    switch (filter) {
      case "published":
        filtered = filtered.filter(p => p.resultPublished);
        break;
      case "pending":
        filtered = filtered.filter(p => !p.resultPublished);
        break;
      case "passed":
        filtered = filtered.filter(p => p.score >= 60);
        break;
      case "failed":
        filtered = filtered.filter(p => p.score < 60);
        break;
      default:
        break;
    }
    
    return filtered;
  }, [selectedQuiz, participants, filter]);

  const stats = useMemo(() => {
    const quizParts = participants.filter(p => p.quizId === selectedQuiz?.id);
    return {
      total: quizParts.length,
      averageScore: quizParts.length > 0 
        ? Math.round(quizParts.reduce((sum, p) => sum + p.score, 0) / quizParts.length)
        : 0,
      published: quizParts.filter(p => p.resultPublished).length,
      pending: quizParts.filter(p => !p.resultPublished).length,
    };
  }, [selectedQuiz, participants]);

  const exportToCSV = useCallback(() => {
    if (quizParticipants.length === 0) return;
    
    const worksheet = XLSX.utils.json_to_sheet(quizParticipants);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, `quiz-results-${selectedQuiz.title}.csv`);
  }, [quizParticipants, selectedQuiz]);

  const handlePrint = useCallback(() => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Quiz Results - ${selectedQuiz?.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <h1>${selectedQuiz?.title} - Results</h1>
          ${document.getElementById('results-table').innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }, [selectedQuiz]);

  const togglePublishResult = useCallback((participantId) => {
    setParticipants(prev => prev.map(p => 
      p.id === participantId 
        ? { ...p, resultPublished: !p.resultPublished }
        : p
    ));
  }, []);

  return (
    <div className="p-4 md:p-8 flex-1 overflow-y-auto bg-zinc-950 text-white">
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">Results</h2>
        <p className="text-zinc-400">View and manage participant results</p>
      </div>

      <div className="max-w-7xl space-y-6">
        {/* Quiz Selection */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 md:p-6">
          <label className="block text-zinc-300 mb-3 font-medium">
            Select Quiz
          </label>
          <select
            value={selectedQuiz?.id || ""}
            onChange={(e) =>
              setSelectedQuiz(
                data.quizzes.find((q) => q.id === parseInt(e.target.value))
              )
            }
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white"
          >
            <option value="">Choose a quiz</option>
            {data.quizzes.map((quiz) => (
              <option key={quiz.id} value={quiz.id}>
                {quiz.title}
              </option>
            ))}
          </select>
        </div>

        {selectedQuiz && (
          <>
            {/* Stats and Filters */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 md:p-4">
                <p className="text-zinc-400 text-sm mb-1">Total Participants</p>
                <p className="text-xl md:text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 md:p-4">
                <p className="text-zinc-400 text-sm mb-1">Average Score</p>
                <p className="text-xl md:text-2xl font-bold text-blue-400">
                  {stats.averageScore}%
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 md:p-4">
                <p className="text-zinc-400 text-sm mb-1">Published</p>
                <p className="text-xl md:text-2xl font-bold text-green-400">
                  {stats.published}
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 md:p-4">
                <p className="text-zinc-400 text-sm mb-1">Pending</p>
                <p className="text-xl md:text-2xl font-bold text-yellow-400">
                  {stats.pending}
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 md:p-4 col-span-2 md:col-span-1">
                <p className="text-zinc-400 text-sm mb-1">Filter</p>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full bg-zinc-800 text-white border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-white"
                >
                  <option value="all">All</option>
                  <option value="published">Published</option>
                  <option value="pending">Pending</option>
                  <option value="passed">Passed (≥60%)</option>
                  <option value="failed">Failed (&lt;60%)</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap my-4">
              <button
                onClick={exportToCSV}
                className="px-4 md:px-6 py-2 md:py-3 bg-white text-zinc-900 rounded-lg font-semibold hover:bg-zinc-200 transition-all flex items-center gap-2 border border-zinc-300"
              >
                <FiDownload />
                Export CSV
              </button>
              <button
                onClick={handlePrint}
                className="px-4 md:px-6 py-2 md:py-3 bg-white text-zinc-900 rounded-lg font-semibold hover:bg-zinc-200 transition-all flex items-center gap-2 border border-zinc-300"
              >
                <FiPrinter />
                Print Results
              </button>
            </div>

            {/* Results Table */}
            <div id="results-table" className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-800 border-b border-zinc-700">
                      <th className="px-4 md:px-6 py-3 md:py-4 text-left text-zinc-300 font-semibold text-sm">Name</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-left text-zinc-300 font-semibold text-sm">Roll No</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-left text-zinc-300 font-semibold text-sm">Course</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-center text-zinc-300 font-semibold text-sm">Score</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-center text-zinc-300 font-semibold text-sm">Status</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-center text-zinc-300 font-semibold text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizParticipants.map((participant) => (
                      <tr
                        key={participant.id}
                        className="border-b border-zinc-700 hover:bg-zinc-800/50 transition-colors"
                      >
                        <td className="px-4 md:px-6 py-3 md:py-4 text-white font-medium text-sm">{participant.name}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-zinc-300 text-sm">{participant.rollNo}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-zinc-300 text-sm">{participant.course}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                          <span
                            className={`px-2 md:px-3 py-1 rounded-full font-semibold text-xs ${participant.score >= 60
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                              }`}
                          >
                            {participant.score}%
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                          <span
                            className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${participant.resultPublished
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                              }`}
                          >
                            {participant.resultPublished ? "Published" : "Pending"}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                          <div className="flex justify-center gap-1 md:gap-2">
                            <button
                              onClick={() => togglePublishResult(participant.id)}
                              className={`p-1 md:p-2 rounded-lg transition-all ${participant.resultPublished
                                  ? "bg-red-500/20 text-red-400 hover:bg-red-600/30"
                                  : "bg-green-500/20 text-green-400 hover:bg-green-600/30"
                                }`}
                              title={participant.resultPublished ? "Hide Result" : "Publish Result"}
                            >
                              {participant.resultPublished ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                            </button>
                            <button
                              className="p-1 md:p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all"
                              title="View Details"
                            >
                              <FiInfo size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {quizParticipants.length === 0 && (
                <div className="text-center py-8 md:py-12">
                  <FiBarChart2 className="text-4xl md:text-6xl text-zinc-600 mx-auto mb-3 md:mb-4" />
                  <p className="text-zinc-400 text-sm md:text-lg">
                    No participants found for the selected filter
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {!selectedQuiz && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-8 md:p-12 text-center">
            <FiBarChart2 className="text-4xl md:text-6xl text-zinc-600 mx-auto mb-3 md:mb-4" />
            <p className="text-zinc-400 text-sm md:text-lg">
              Select a quiz to view results
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
