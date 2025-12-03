const Quiz = require('../models/quiz');
const Attempt = require('../models/Attempt');

function computeMaxScore(quiz) {
  return (quiz.questions || []).reduce((s, q) => s + (q.marks || 1), 0);
}

function evaluate(quiz, attempt) {
  let total = 0;
  const qmap = {};
  quiz.questions.forEach(q => { qmap[q._id?.toString() || q.id] = q; });
  attempt.answers.forEach(a => {
    const q = qmap[a.questionId?.toString()];
    if (!q) return;
    const correctIndex = q.correctIndex;
    if (typeof a.selectedIndex === 'number' && a.selectedIndex === correctIndex) {
      a.correct = true;
      const m = q.marks || 1;
      a.marksObtained = m;
      total += m;
    } else {
      a.correct = false;
      a.marksObtained = 0;
    }
  });
  return { total, answers: attempt.answers };
}

exports.joinByCode = async (req, res) => {
  const { joinCode } = req.body;
  if (!joinCode) return res.status(400).json({ error: 'joinCode required' });

  const quiz = await Quiz.findOne({ joinCode });
  if (!quiz) return res.status(404).json({ error: 'Invalid code' });

  // only allow joining if live and within time window
  const now = new Date();
  if (quiz.status !== 'live') return res.status(400).json({ error: 'Quiz not live' });
  if (quiz.startAt && now < new Date(quiz.startAt)) return res.status(400).json({ error: 'Quiz not started yet' });
  if (quiz.endAt && now > new Date(quiz.endAt)) return res.status(400).json({ error: 'Quiz ended' });

  // check maxParticipants
  if (quiz.maxParticipants && quiz.maxParticipants > 0) {
    const count = await Attempt.countDocuments({ quiz: quiz._id });
    if (count >= quiz.maxParticipants) return res.status(400).json({ error: 'Quiz full' });
  }

  // create attempt
  const attempt = new Attempt({
    quiz: quiz._id,
    participant: req.session.userId,
    answers: [], // will be filled by submit
    maxScore: computeMaxScore(quiz),
    status: 'in_progress',
    startedAt: new Date()
  });

  await attempt.save();
  res.json({ attemptId: attempt._id, quiz: { id: quiz._id, title: quiz.title, durationMinutes: quiz.durationMinutes || null, questions: quiz.questions.map(q => ({ id: q._id, text: q.text, options: q.options })) } });
};

exports.submitAttempt = async (req, res) => {
  const { attemptId } = req.params;
  const { answers } = req.body; // array of { questionId, selectedIndex }
  if (!attemptId) return res.status(400).json({ error: 'attemptId required' });

  const attempt = await Attempt.findById(attemptId);
  if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
  if (attempt.participant.toString() !== req.session.userId) return res.status(403).json({ error: 'Not your attempt' });

  if (attempt.status !== 'in_progress') return res.status(400).json({ error: 'Already submitted' });

  // load quiz
  const quiz = await Quiz.findById(attempt.quiz);
  attempt.answers = answers.map(a => ({ questionId: a.questionId, selectedIndex: a.selectedIndex }));
  attempt.submittedAt = new Date();
  attempt.status = 'submitted';

  // evaluate immediately
  const ev = evaluate(quiz, attempt);
  attempt.totalScore = ev.total;
  attempt.maxScore = computeMaxScore(quiz);
  await attempt.save();

  res.json({ attempt });
};

// fetch my attempts
exports.myAttempts = async (req, res) => {
  const attempts = await Attempt.find({ participant: req.session.userId }).populate('quiz', 'title startAt endAt status');
  res.json({ attempts });
};


exports.dashboardData = async (req, res) => {
  try {
    const userId = req.session.userId;

    // 1) TOTAL QUIZZES
    const totalQuizzes = await Quiz.countDocuments();

    // 2) USER ATTEMPTS
    const attempts = await Attempt.find({ participant: userId })
      .sort({ submittedAt: -1 })
      .limit(5)
      .populate("quiz", "title startAt");

    const attempted = attempts.length;

    let averageScore = 0;
    if (attempted > 0) {
      averageScore =
        attempts.reduce(
          (sum, a) => sum + (a.totalScore || 0),
          0
        ) / attempted;
    }

    // RECENT ATTEMPTS (for frontend UI)
    const recentAttempts = attempts.map((a) => ({
      quizTitle: a.quiz?.title,
      score: a.totalScore || 0,
      attemptedAt: a.submittedAt,
    }));

    // 3) UPCOMING QUIZZES
    const upcoming = await Quiz.find({
      startAt: { $gte: new Date() },
      status: "scheduled"
    }).select("title startAt");

    return res.json({
      stats: {
        totalQuizzes,
        attempted,
        averageScore: Math.round(averageScore),
        rank: "-", // not implementing ranking yet
      },
      recentAttempts,
      upcoming,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};
