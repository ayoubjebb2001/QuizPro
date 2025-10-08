var express = require('express');
var router = express.Router();
const QuizController = require('../Controllers/QuizController');

/**
 * Routes du Quiz
 * Toute la logique métier est déléguée au QuizController
 */

// GET /quiz ou /quiz/start - Afficher les catégories disponibles
router.get(['/', '/start'], QuizController.showCategories);

// GET /quiz/category/:id - Afficher les questions d'une catégorie
router.get('/category/:id', QuizController.showQuestions);

// POST /quiz/submit - Soumettre les réponses et calculer le score
router.post('/submit', QuizController.submitQuiz);

// GET /quiz/result - Afficher les résultats du quiz
router.get('/result', QuizController.showResult);

module.exports = router;
