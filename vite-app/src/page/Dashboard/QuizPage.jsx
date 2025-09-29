import React, { useEffect, useState } from "react";
import axios from "axios";

// Mock fallback if API fails
const MOCK_DATA = {
  title: "Sample Quiz",
  questions: Array(50)
    .fill(null)
    .map((_, i) => ({
      text: ` What is the capital of Australia?`,
      options: ["Sydney", "Melbourne", "Canberra", "Wellington"],
      answer: "Canberra",
      // section: `Section ${String.fromCharCode(65 + Math.floor(i / 20))}`, // A, B, C, etc.
      section: i < 20 ? "Section A" : i < 40 ? "Section B" : "Section C",
    })),
};

// Helpers
const getSectionsFromQuestions = (questions) => [
  ...new Set(questions.map((q) => q.section || "General")),
];

const QuizPage = ({ User, Quiz }) => {
  const [data, setData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get("https://api.example.com/quiz");
        setData(response.data);
      } catch (error) {
        console.warn("Using fallback data due to fetch error:", error);
        setData(MOCK_DATA);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizData();
  }, []);

  useEffect(() => {
    if (data?.questions?.length) {
      const sections = getSectionsFromQuestions(data.questions);
      setActiveSection(sections[0]);
    }
  }, [data]);

  const currentQuestion = data?.questions[currentQuestionIndex];
  const totalQuestions = data?.questions.length || 0;

  const handleAnswer = (option) =>
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: option }));

  const markForReview = () => {
    setReviews((prev) =>
      prev.includes(currentQuestionIndex)
        ? prev
        : [...prev, currentQuestionIndex]
    );
  };

  const goToQuestion = (index) => setCurrentQuestionIndex(index);

  const answeredCount = Object.keys(answers).length;
  const reviewedCount = reviews.length;
  const notAnsweredCount = totalQuestions - answeredCount;

  const handleSubmit = () => {
    console.log("Submitting answers:", answers);

    axios
      .post("https://api.example.com/submit-quiz", {
        userId: User.user_Id,
        quizId: Quiz.Id,
        answers,
        reviews,
      })
      .then((res) => {
        alert("Quiz submitted successfully!");
      })
      .catch((err) => {
        alert("Error submitting quiz.");
      });
  };

  const sections = data ? getSectionsFromQuestions(data.questions) : [];

  const filteredQuestions = data?.questions
    .map((q, i) => ({ ...q, index: i }))
    .filter((q) => q.section === activeSection);

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col">
      <Navbar />

      <main className="flex flex-grow px-4 py-6 gap-4 roboto flex-col md:flex-row">
        {/* Left: Quiz Section */}
        <section className="w-full md:w-3/4 bg-zinc-800 p-6 rounded-lg shadow-lg flex flex-col">
          {/* Tabs */}
          <nav className="flex gap-2 mb-4">
            {sections.map((tab, idx) => (
              <button
                key={tab}
                onClick={() => setActiveSection(tab)}
                className={`px-4 py-2 rounded ${
                  tab === activeSection ? "bg-zinc-700" : "bg-zinc-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="self-end mb-4 text-sm">⏱ 00:00</div>

          {!loading && currentQuestion && (
            <>
              <div className="text-lg font-semibold mb-4">
                {currentQuestionIndex + 1}. {currentQuestion.text}
              </div>

              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={opt}
                      checked={answers[currentQuestionIndex] === opt}
                      onChange={() => handleAnswer(opt)}
                      className="accent-blue-500"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 mt-auto">
                <ActionButton
                  text="Mark for Review"
                  onClick={markForReview}
                  disabled={reviews.includes(currentQuestionIndex)}
                />
                <ActionButton
                  text="Previous"
                  disabled={currentQuestionIndex === 0}
                  onClick={() =>
                    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
                  }
                />
                <ActionButton
                  text="Next"
                  disabled={currentQuestionIndex >= totalQuestions - 1}
                  onClick={() =>
                    setCurrentQuestionIndex((prev) =>
                      Math.min(prev + 1, totalQuestions - 1)
                    )
                  }
                />
              </div>
            </>
          )}
        </section>

        {/* Sidebar */}
        <aside className="w-full md:w-1/4 bg-zinc-800 p-6 rounded-lg flex flex-col gap-4 shadow-lg h-full">
          {/* User Info */}
          <div className="flex-[4] text-sm overflow-auto">
            <div className="bg-zinc-900 p-4 rounded">
              <p>
                <strong>User:</strong> {User.name}
              </p>
              <p>
                <strong>ID:</strong> {User.user_Id}
              </p>
              <p>
                <strong>Program:</strong> {User.Program}
              </p>
              <p>
                <strong>Course:</strong> {Quiz.course}
              </p>
            </div>
          </div>

          <hr />

          {/* Question Grid */}
          <div className="flex-[6] flex flex-col overflow-auto">
            <h3 className="text-md font-bold mb-2">{activeSection}</h3>
            <div className="grid md:grid-cols-5 sm:grid-cols-6 grid-cols-4 gap-2 mb-6 overflow-y-auto overflow-x-hidden max-h-[460px]">
              {filteredQuestions?.map(({ index }) => {
                const isAnswered = answers[index] !== undefined;
                const isReview = reviews.includes(index);

                let bg = "bg-yellow-400";
                if (isAnswered) bg = "bg-green-500";
                if (isReview) bg = "bg-blue-500";

                return (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`w-16 h-16 font-semibold rounded ${bg} text-black hover:scale-105 transition-transform`}
                    title={`Question ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex-[4] text-sm space-y-2 overflow-auto">
            <hr />
            <Legend color="green-500" label="Answered" count={answeredCount} />
            <Legend
              color="yellow-400"
              label="Not Answered"
              count={notAnsweredCount}
            />
            <Legend
              color="blue-500"
              label="Marked for Review"
              count={reviewedCount}
            />
          </div>

          {/* Submit */}
          <div className="flex-[2] flex items-end">
            <ActionButton text="Submit" fullWidth onClick={handleSubmit} />
          </div>
        </aside>
      </main>
    </div>
  );
};

// Reusable Components
const ActionButton = ({
  text,
  onClick = () => {},
  fullWidth = false,
  disabled = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${
      fullWidth ? "w-full" : "px-6"
    } py-2 bg-white text-black font-semibold rounded hover:opacity-90 active:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50 disabled:active:scale-100`}
  >
    {text}
  </button>
);

const Legend = ({ color, label, count }) => (
  <div className="flex items-center space-x-2">
    <div className={`w-4 h-4 bg-${color} rounded`} />
    <span>
      {label} ({count})
    </span>
  </div>
);

const Navbar = () => (
  <nav className="w-full bg-none text-white px-16 py-4 flex justify-between items-center">
    <div className="text-2xl font-bold bricolage">Quizzy</div>
    <button
      type="button"
      className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/10 transition-colors"
      aria-label="Quiz information"
      title="View quiz details"
    >
      <span className="text-sm font-mono">i</span>
    </button>
  </nav>
);

export default QuizPage;

/********************************************************************************************************* */

{
  /* <aside className="w-full md:w-1/4 bg-zinc-800 p-6 rounded-lg flex flex-col justify-evenly- shadow-lg"> */
}
//   {/* User Info */}
//   <div className="mb-6 text-sm ">
//     <div className="bg-zinc-900 p-4 rounded">
//       <p>
//         {" "}
//         <strong>User:</strong>User.name{" "}
//       </p>
//       <p>
//         {" "}
//         <strong>ID:</strong>User.user_Id{" "}
//       </p>
//       <p>
//         {" "}
//         <strong>Program</strong>User.Program{" "}
//       </p>
//       <p>
//         {" "}
//         <strong>Course</strong>Quiz.course{" "}
//       </p>
//     </div>
//   </div>
//   {/* Question Grid */}
//   <div className=" flex-col">
//     <hr />
//     <h3 className="text-md font-bold mb-2 ">Section A</h3>
//     <div className="grid grid-cols-5 gap-2 mb-6">
//       {data?.questions.map((_, i) => {
//         const isAnswered = answers[i] !== undefined;
//         const isReview = reviews.includes(i);
//         let bg = "bg-yellow-400";
//         if (isAnswered) bg = "bg-green-500";
//         if (isReview) bg = "bg-blue-500";
//         return (
//           <button
//             key={i}
//             onClick={() => goToQuestion(i)}
//             className={`w-16 h-16 font-semibold rounded ${bg} text-black hover:scale-105 transition-transform`}
//             title={`Question ${i + 1}`}
//           >
//             {" "}
//             {i + 1}{" "}
//           </button>
//         );
//       })}
//     </div>
//     {/* Legend */}
//     <div className="text-sm space-y-2 mt-auto">
//       <hr />
//       <Legend color="green-500" label="Answered" count={answeredCount} />
//       <Legend
//         color="yellow-400"
//         label="Not Answered"
//         count={notAnsweredCount}
//       />
//       <Legend
//         color="blue-500"
//         label="Marked for Review"
//         count={reviewedCount}
//       />
//     </div>
//   </div>
//   {/* Submit */}
//   <ActionButton text="Submit" fullWidth onClick={handleSubmit} />{" "}
// </aside>

/********************************************************************************************************* */

// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import axios from "axios";

// // Fixed mock data - avoid object reference sharing
// const MOCK_DATA = {
//   title: "Sample Quiz",
//   questions: Array.from({ length: 5 }, (_, index) => ({
//     id: `mock-question-${index}`,
//     text: "Which of the following is the capital city of Australia?",
//     options: ["Sydney", "Melbourne", "Canberra", "Wellington"],
//     answer: "Canberra",
//   })),
// };

// const TABS = ["Section A", "Section B", "Section C"];

// // Static color mapping to avoid Tailwind purging issues
// const COLOR_CLASSES = {
//   "green-500": "bg-green-500",
//   "yellow-400": "bg-yellow-400",
//   "blue-500": "bg-blue-500",
// };

// const QuizPage = (
//   User = { name: 'John Smith', user_Id: 999999999, Program: "B.tech" },
//   Quiz = { course: "History", Id: 'AQjavbna51' }
// ) => {
//   const [data, setData] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let isMounted = true;

//     const fetchQuizData = async () => {
//       try {
//         const response = await axios.get("https://api.example.com/quiz", {
//           timeout: 10000
//         });
//         if (isMounted) {
//           setData(response.data || MOCK_DATA);
//           setError(null);
//         }
//       } catch (error) {
//         console.error("Error fetching quiz data:", error);
//         if (isMounted) {
//           setData(MOCK_DATA);
//           setError("Failed to load quiz data. Using demo version.");
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchQuizData();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // Memoized values for performance
//   const totalQuestions = useMemo(() => data?.questions?.length || 0, [data]);
//   const currentQuestion = useMemo(() => data?.questions?.[currentQuestionIndex], [data, currentQuestionIndex]);
//   const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
//   const reviewedCount = useMemo(() => reviews.length, [reviews]);
//   const notAnsweredCount = useMemo(() => Math.max(totalQuestions - answeredCount, 0), [totalQuestions, answeredCount]);

//   // Memoized callbacks
//   const handleAnswer = useCallback((selectedOption) => {
//     setAnswers(prev => ({
//       ...prev,
//       [currentQuestionIndex]: selectedOption
//     }));
//   }, [currentQuestionIndex]);

//   const markForReview = useCallback(() => {
//     setReviews(prev => {
//       const isAlreadyReviewed = prev.includes(currentQuestionIndex);
//       if (isAlreadyReviewed) {
//         return prev.filter(index => index !== currentQuestionIndex);
//       }
//       return [...prev, currentQuestionIndex];
//     });
//   }, [currentQuestionIndex]);

//   const goToQuestion = useCallback((index) => {
//     if (index >= 0 && index < totalQuestions) {
//       setCurrentQuestionIndex(index);
//     }
//   }, [totalQuestions]);

//   const handlePrevious = useCallback(() => {
//     setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));
//   }, []);

//   const handleNext = useCallback(() => {
//     setCurrentQuestionIndex(prev => Math.min(prev + 1, totalQuestions - 1));
//   }, [totalQuestions]);

//   const handleSubmit = useCallback(async () => {
//     if (submitting) return;

//     setSubmitting(true);
//     try {
//       const response = await axios.post('https://api.example.com/submit-quiz', {
//         userId: User.user_Id,
//         quizId: Quiz.Id, // Fixed: was User.Quiz_Id
//         answers: answers,
//         reviews: reviews,
//       }, {
//         timeout: 15000
//       });

//       console.log('Submission successful:', response.data);
//       alert('Quiz submitted successfully!');
//     } catch (error) {
//       console.error('Submission error:', error);
//       alert('Error submitting quiz. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   }, [User.user_Id, Quiz.Id, answers, reviews, submitting]);

//   return (
//     <div className="min-h-screen w-full bg-black text-white flex flex-col">
//       <Navbar />

//       <main className="flex flex-grow px-4 py-6 gap-4 roboto">
//         {/* Left: Quiz Section */}
//         <section className="w-full md:w-3/4 bg-zinc-800 p-6 rounded-lg shadow-lg flex flex-col">
//           {/* Section Tabs */}
//           <nav className="flex gap-2 mb-4" role="tablist">
//             {TABS.map((tab, idx) => (
//               <button
//                 key={tab}
//                 type="button"
//                 role="tab"
//                 aria-selected={idx === 0}
//                 className={`px-4 py-2 rounded transition-colors ${
//                   idx === 0 ? "bg-zinc-700" : "bg-gray-900 hover:bg-gray-800"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </nav>

//           {/* Timer */}
//           <div className="self-end mb-4 text-sm" aria-live="polite">
//             ⏱ 00:00
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded text-yellow-200 text-sm">
//               {error}
//             </div>
//           )}

//           {/* Loading State */}
//           {loading && (
//             <div className="flex-1 flex items-center justify-center">
//               <div className="text-zinc-400">Loading quiz...</div>
//             </div>
//           )}

//           {/* Quiz Content */}
//           {!loading && currentQuestion && (
//             <>
//               <div className="text-lg font-semibold mb-4">
//                 {currentQuestionIndex + 1}. {currentQuestion.text}
//               </div>

//               <fieldset className="space-y-3 mb-6">
//                 <legend className="sr-only">Choose your answer</legend>
//                 {currentQuestion.options.map((opt, idx) => {
//                   const inputId = `question-${currentQuestionIndex}-option-${idx}`;
//                   return (
//                     <div key={inputId} className="flex items-center space-x-3">
//                       <input
//                         id={inputId}
//                         type="radio"
//                         name={`question-${currentQuestionIndex}`}
//                         value={opt}
//                         checked={answers[currentQuestionIndex] === opt}
//                         onChange={() => handleAnswer(opt)}
//                         className="accent-blue-500 w-4 h-4"
//                       />
//                       <label
//                         htmlFor={inputId}
//                         className="cursor-pointer flex-1 py-1"
//                       >
//                         {opt}
//                       </label>
//                     </div>
//                   );
//                 })}
//               </fieldset>

//               <div className="flex flex-wrap gap-3 mt-auto">
//                 <ActionButton
//                   text={reviews.includes(currentQuestionIndex) ? "Unmark Review" : "Mark for Review"}
//                   onClick={markForReview}
//                 />
//                 <ActionButton
//                   text="Previous"
//                   onClick={handlePrevious}
//                   disabled={currentQuestionIndex === 0}
//                 />
//                 <ActionButton
//                   text="Next"
//                   onClick={handleNext}
//                   disabled={currentQuestionIndex >= totalQuestions - 1}
//                 />
//               </div>
//             </>
//           )}

//           {/* No Questions State */}
//           {!loading && !currentQuestion && totalQuestions === 0 && (
//             <div className="flex-1 flex items-center justify-center text-zinc-400">
//               No questions available
//             </div>
//           )}
//         </section>

//         {/* Right: Sidebar */}
//         <aside className="w-full md:w-1/4 bg-zinc-800 p-6 rounded-lg shadow-lg flex flex-col">
//           {/* User Info */}
//           <div className="mb-6 text-sm">
//             <div className="bg-zinc-900 p-4 rounded space-y-1">
//               <p><strong>User:</strong> {User?.name || "N/A"}</p>
//               <p><strong>ID:</strong> {User?.user_Id || "N/A"}</p>
//               <p><strong>Program:</strong> {User?.Program || "N/A"}</p>
//               <p><strong>Course:</strong> {Quiz?.course || "N/A"}</p>
//             </div>
//           </div>

//           <hr className="border-zinc-700 mb-6"/>

//           {/* Question Grid */}
//           <div className="flex-1 flex flex-col">
//             <h3 className="text-md font-bold mb-3">Section A</h3>
//             <div className="grid grid-cols-5 gap-2 mb-6">
//               {data?.questions?.map((_, i) => {
//                 const isAnswered = answers[i] !== undefined;
//                 const isReview = reviews.includes(i);
//                 const isCurrent = i === currentQuestionIndex;

//                 let bgClass = COLOR_CLASSES["yellow-400"]; // Not answered
//                 if (isAnswered) bgClass = COLOR_CLASSES["green-500"]; // Answered
//                 if (isReview) bgClass = COLOR_CLASSES["blue-500"]; // Marked for review

//                 return (
//                   <button
//                     key={`question-${i}`}
//                     type="button"
//                     onClick={() => goToQuestion(i)}
//                     className={`
//                       w-12 h-12 md:w-14 md:h-14 font-semibold rounded text-black
//                       hover:scale-105 transition-transform focus:outline-none
//                       focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-800
//                       ${bgClass}
//                       ${isCurrent ? 'ring-2 ring-white' : ''}
//                     `}
//                     title={`Question ${i + 1}${isAnswered ? ' (Answered)' : ''}${isReview ? ' (Marked for Review)' : ''}`}
//                     aria-current={isCurrent}
//                   >
//                     {i + 1}
//                   </button>
//                 );
//               })}
//             </div>

//             <hr className="border-zinc-700 mb-4"/>

//             {/* Legend */}
//             <div className="text-sm space-y-2 mb-6">
//               <Legend color="green-500" label="Answered" count={answeredCount} />
//               <Legend color="yellow-400" label="Not Answered" count={notAnsweredCount} />
//               <Legend color="blue-500" label="Marked for Review" count={reviewedCount} />
//             </div>

//             {/* Submit Button */}
//             <ActionButton
//               text={submitting ? "Submitting..." : "Submit"}
//               fullWidth
//               onClick={handleSubmit}
//               disabled={submitting || totalQuestions === 0}
//             />
//           </div>
//         </aside>
//       </main>
//     </div>
//   );
// };

// // Reusable Button Component
// const ActionButton = ({
//   text,
//   onClick = () => {},
//   fullWidth = false,
//   disabled = false
// }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     disabled={disabled}
//     className={`
//       ${fullWidth ? "w-full" : "px-6"} py-2 bg-white text-black font-semibold rounded
//       hover:opacity-90 active:scale-105 transition
//       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50 disabled:active:scale-100
//     `}
//   >
//     {text}
//   </button>
// );

// // Reusable Legend Component
// const Legend = ({ color, label, count }) => (
//   <div className="flex items-center space-x-2">
//     <div className={`w-4 h-4 ${COLOR_CLASSES[color]} rounded`} />
//     <span>{label} ({count})</span>
//   </div>
// );

// const Navbar = () => {
//   return (
//     <nav className="w-full bg-none text-white px-6 md:px-16 py-4 flex justify-between items-center">
//       <div className="text-2xl font-bold bricolage">Quizzy</div>
//       <button
//         type="button"
//         className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/10 transition-colors"
//         aria-label="Quiz information"
//         title="View quiz details"
//       >
//         <span className="text-sm font-mono">i</span>
//       </button>
//     </nav>
//   );
// };

// export default QuizPage;
