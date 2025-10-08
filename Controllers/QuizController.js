const { json } = require('express');
const Category = require('../Models/Category');
const Question = require('../Models/Question');
const Score = require('../Models/Score');

/**
 * QuizController - Gère toute la logique métier du quiz
 */
class QuizController {
    /**
     * GET /quiz/start - Afficher la liste des catégories
     */
    static showCategories(req, res) {
        Category.getAllCategories((err, result) => {
            if (err) {
                return res.render('Quiz/start', {
                    title: 'Choisir une catégorie',
                    categories: [],
                    error: err.message,
                    user: req.session.user
                });
            }
            res.render('Quiz/start', {
                title: 'Choisir une catégorie',
                categories: result,
                error: null,
                user: req.session.user
            });
        });
    }

    /**
     * GET /quiz/category/:id - Afficher les questions d'une catégorie
     */
    static showQuestions(req, res) {
        const categoryId = parseInt(req.params.id, 10);

        // Validation de l'ID
        if (isNaN(categoryId)) {
            return res.status(400).render('Quiz/questions', {
                title: 'Quiz',
                user: req.session.user || null,
                category: null,
                questions: [],
                error: 'Catégorie invalide.'
            });
        }

        // Utiliser QuestionParCategory du modèle Question
        Question.QuestionParCategory(categoryId, (err, result) => {
            if (err) {
                console.error('Error loading questions:', err);
                return res.status(500).render('Quiz/questions', {
                    title: 'Quiz',
                    user: req.session.user || null,
                    category: null,
                    questions: [],
                    error: 'Erreur serveur lors du chargement du quiz.'
                });
            }

            // Vérifier s'il y a des résultats
            if (!result || result.length === 0) {
                return res.status(404).render('Quiz/questions', {
                    title: 'Quiz',
                    user: req.session.user || null,
                    category: null,
                    questions: [],
                    error: 'Aucune question disponible pour cette catégorie.'
                });
            }

            // Extraire la catégorie du premier résultat
            const category = {
                id: result[0].category_id,
                NAME: result[0].NAME,
                description: result[0].description
            };

            // Mapper et parser les questions avec leurs options et réponses
            const questions = result.map(row => {
                let options = [];
                let answer = [];

                // Parser options (JSON string -> Array)
                try {
                    options = typeof row.options === 'string' ? JSON.parse(row.options) : row.options;
                    if (!Array.isArray(options)) options = [];
                } catch (e) {
                    console.error('Error parsing options for question', row.question_id, e);
                    options = [];
                }

                // Parser answer (JSON string -> Array)
                try {
                    answer = typeof row.answer === 'string' ? JSON.parse(row.answer) : row.answer;
                    if (!Array.isArray(answer)) answer = [];
                } catch (e) {
                    console.error('Error parsing answer for question', row.question_id, e);
                    answer = [];
                }

                return {
                    id: row.question_id,
                    question: row.question,
                    options: options,
                    answer: answer
                };
            });

            // Stocker les réponses correctes en session (SANS les envoyer au client)
            const answers = {};
            questions.forEach(q => {
                answers[q.id] = q.answer;
            });

            req.session.currentQuiz = {
                category_id: categoryId,
                answers: answers,
                questions: questions.map(q => ({
                    id: q.id,
                    question: q.question
                }))
            };

            // Préparer sanitizedQuestions SANS les réponses correctes (pour le client)
            const sanitizedQuestions = questions.map(q => ({
                id: q.id,
                question: q.question,
                options: q.options
            }));

            res.render('Quiz/questions', {
                title: `Quiz - ${category.NAME}`,
                user: req.session.user || null,
                questions: sanitizedQuestions,
                category,
                error: null
            });
        });
    }

    /**
     * POST /quiz/submit - Évaluer les réponses et calculer le score
     */
    static submitQuiz(req, res) {
        // Vérifier si un quiz est en cours
        if (!req.session.currentQuiz) {
            return res.status(400).redirect('/quiz/start');
        }

        // Vérifier l'authentification
        if (!req.session.user) {
            return res.status(401).redirect('/auth');
        }

        const { currentQuiz } = req.session;
        const submittedAnswers = req.body; // Format: { q_1: "option", q_2: "option", ... }

        let totalQuestions = 0;
        let correctAnswers = 0;
        const detail = [];

        // Évaluer chaque question
        Object.entries(currentQuiz.answers).forEach(([questionId, correctAnswersArray]) => {
            totalQuestions += 1;
            const fieldName = 'q_' + questionId;
            const userAnswer = submittedAnswers[fieldName];

            // Normaliser les réponses en ensembles (Set) pour comparaison
            const correctSet = new Set(
                (correctAnswersArray || []).map(ans => String(ans).trim())
            );
            const userSet = new Set(
                [].concat(userAnswer || []).map(ans => String(ans).trim())
            );

            // Comparer les ensembles
            const isCorrect =
                correctSet.size === userSet.size &&
                [...correctSet].every(ans => userSet.has(ans));

            if (isCorrect) {
                correctAnswers += 1;
            }

            detail.push({
                question_id: Number(questionId),
                correct: isCorrect,
                userAnswer: [...userSet],
                expected: [...correctSet]
            });
        });

        // Calculer le score en pourcentage
        const scorePercent =
            totalQuestions === 0 ? 0 : Math.round((correctAnswers / totalQuestions) * 100);

        // Insérer le score dans la base de données avec le modèle Score
        Score.create(req.session.user.id, scorePercent, currentQuiz.category_id, (err) => {
            if (err) {
                console.error('Error saving score:', err);
                // Continuer même si la sauvegarde échoue
            }

            // Stocker le résultat en session pour la page de résultat
            req.session.lastResult = {
                category_id: currentQuiz.category_id,
                score: scorePercent,
                totalQuestions,
                correct: correctAnswers,
                detail
            };

            // Nettoyer le quiz en cours
            delete req.session.currentQuiz;

            // Rediriger vers la page de résultat
            res.redirect('/quiz/result');
        });
    }

    /**
     * GET /quiz/result - Afficher les résultats du quiz
     */
    static showResult(req, res) {
        const result = req.session.lastResult;

        // Vérifier si un résultat existe
        if (!result) {
            return res.redirect('/quiz/start');
        }

        // Charger les informations de la catégorie avec le modèle Category
        Category.getCategoryById(result.category_id, (err, rows) => {
            if (err) {
                console.error('Error loading category for result:', err);
                return res.render('Quiz/result', {
                    title: 'Résultat du Quiz',
                    user: req.session.user || null,
                    result,
                    category: null
                });
            }

            const category = rows[0] || null;

            // Rendre la vue de résultat
            res.render('Quiz/result', {
                title: 'Résultat du Quiz',
                user: req.session.user || null,
                result,
                category
            });
        });
    }
}

module.exports = QuizController;
