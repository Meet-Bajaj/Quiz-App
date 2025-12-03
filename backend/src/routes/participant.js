const router = require('express').Router();
const ensureAuth = require('../middlewares/ensureAuth');
const participantCtrl = require('../controllers/participantCtrl');

router.use(ensureAuth);

router.post('/join', participantCtrl.joinByCode); // body: { joinCode }
router.post('/attempt/:attemptId/submit', participantCtrl.submitAttempt); // body: { answers: [] }
router.get('/me/attempts', participantCtrl.myAttempts);
router.get('/dashboard', participantCtrl.dashboardData);

module.exports = router;
