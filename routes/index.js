var express = require('express');
var router = express.Router();
const DashboardController = require('../Controllers/DashboardController');

/* GET dashboard page. */
router.get('/', async function (req, res, next) {
  try {
    const user = req.session.user || null;
    const data = await DashboardController.getData(user ? user.id : null);

    // res.status(200).json(data);
    res.render('dashboard', {
      title: 'User Dashboard',
      user,
      stats: {
        avgScore: data.avgScore,
        gamesPlayed: data.gamesPlayed,
        globalRank: data.globalRank
      },
      recentScores: data.recentScores,
      categoryBreakdown: data.categoryBreakdown,
      leaderboard: data.globalLeaderboard,
      error: data.error || null
    });
  } catch (err) {
    console.error('Dashboard route error:', err);
    res.render('dashboard', {
      title: 'User Dashboard',
      user: req.session.user || null,
      stats: { avgScore: 0, gamesPlayed: 0, globalRank: null },
      recentScores: [],
      categoryBreakdown: [],
      leaderboard: [],
      error: 'Une erreur est survenue lors du chargement des données.'
    });
  }
});

module.exports = router;
