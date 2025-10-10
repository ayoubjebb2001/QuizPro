const Category = require('../Models/Category');
const Question = require('../Models/Question');
const Score = require('../Models/Score');

class QuizController {
    static showCategories(req, res) {
        Category.getAllCategories((err, categories) => {
            if (err) {
                console.error('showCategories error:', err);
                console.log('showCategories payload:', {
                    categories: [],
                    error: err.message
                });
                return res.render('Quiz/start', {
                    title: 'Choisir une catégorie',
                    categories: [],
                    error: err.message,
                    user: req.session.user
                });
            }

            console.log('showCategories payload:', {
                categories,
                error: null
            });

            res.render('Quiz/start', {
                title: 'Choisir une catégorie',
                categories,
                error: null,
                user: req.session.user
            });
        });
    }

    static showQuestions(req, res) {
        const categoryId = req.params.id;

        if (!categoryId) {
            console.log('showQuestions payload:', {
                category: null,
                questions: [],
                error: 'Catégorie invalide.'
            });

            return res.status(400).render('Quiz/questions', {
                title: 'Quiz',
                user: req.session.user || null,
                category: null,
                questions: [],
                error: 'Catégorie invalide.'
            });
        }

        Question.QuestionParCategory(categoryId, (err, rows) => {
            if (err) {
                console.error('showQuestions error:', err);
                console.log('showQuestions payload:', {
                    category: null,
                    questions: [],
                    error: 'Erreur serveur lors du chargement du quiz.'
                });

                return res.status(500).render('Quiz/questions', {
                    title: 'Quiz',
                    user: req.session.user || null,
                    category: null,
                    questions: [],
                    error: 'Erreur serveur lors du chargement du quiz.'
                });
            }

            if (!rows || rows.length === 0) {
                console.log('showQuestions payload:', {
                    category: null,
                    questions: [],
                    error: 'Aucune question disponible pour cette catégorie.'
                });

                return res.status(404).render('Quiz/questions', {
                    title: 'Quiz',
                    user: req.session.user || null,
                    category: null,
                    questions: [],
                    error: 'Aucune question disponible pour cette catégorie.'
                });
            }

            const category = {
                id: rows[0].category_id,
                NAME: rows[0].NAME,
                description: rows[0].description
            };

            const questions = rows.map((row) => {
                const options = Array.isArray(row.options) ? row.options : [];
                const answers = Array.isArray(row.answer) ? row.answer : [];

                return {
                    id: row.question_id,
                    question: row.question,
                    options,
                    rawOptions: row.options,
                    rawAnswer: row.answer,
                    answers
                };
            });

            req.session.currentQuiz = {
                category_id: categoryId,
                questions,
                answers: questions.reduce((acc, question) => {
                    acc[question.id] = question.answers;
                    return acc;
                }, {})
            };

            console.log('showQuestions payload:', {
                category,
                questions,
                error: null
            });

            res.render('Quiz/questions', {
                title: `Quiz - ${category.NAME}`,
                user: req.session.user || null,
                category,
                questions,
                error: null
            });
        });
    }

    static submitQuiz(req, res) {
        if (!req.session.currentQuiz) {
            return res.status(400).redirect('/quiz/start');
        }

        if (!req.session.user) {
            return res.status(401).redirect('/auth');
        }

        const { currentQuiz } = req.session;
        const submittedAnswers = req.body;

        let totalQuestions = 0;
        let correctAnswers = 0;
        const detail = [];

        Object.keys(currentQuiz.answers).forEach((questionId) => {
            const expected = currentQuiz.answers[questionId] || [];
            const fieldName = `q_${questionId}`;
            let received = submittedAnswers[fieldName];
            if (received === undefined) {
                const altFieldName = `${fieldName}[]`;
                if (Object.prototype.hasOwnProperty.call(submittedAnswers, altFieldName)) {
                    received = submittedAnswers[altFieldName];
                }
            }
            const userAnswerArray = Array.isArray(received) ? received : [received].filter(Boolean);

            const expectedSorted = [...expected].sort();
            const userSorted = [...userAnswerArray].sort();

            const isCorrect = JSON.stringify(expectedSorted) === JSON.stringify(userSorted);

            if (isCorrect) {
                correctAnswers += 1;
            }

            totalQuestions += 1;

            detail.push({
                question_id: questionId,
                expected: expectedSorted,
                userAnswer: userSorted,
                correct: isCorrect
            });
        });

        const score = totalQuestions === 0 ? 0 : Math.round((correctAnswers / totalQuestions) * 100);

        Score.create(req.session.user.id, score, currentQuiz.category_id, (err) => {
            if (err) {
                console.error('submitQuiz score save error:', err);
            }

            req.session.lastResult = {
                category_id: currentQuiz.category_id,
                score,
                totalQuestions,
                correct: correctAnswers,
                detail
            };

            delete req.session.currentQuiz;

            res.redirect('/quiz/result');
        });
    }

    static showResult(req, res) {
        const result = req.session.lastResult;

        if (!result) {
            console.log('showResult payload:', {
                result: null,
                category: null
            });
            return res.redirect('/quiz/start');
        }

        Category.getCategoryById(result.category_id, (err, rows) => {
            if (err) {
                console.error('showResult error:', err);
                console.log('showResult payload:', {
                    result,
                    category: null
                });

                return res.render('Quiz/result', {
                    title: 'Résultat du Quiz',
                    user: req.session.user || null,
                    result,
                    category: null
                });
            }

            const category = rows && rows[0] ? rows[0] : null;

            console.log('showResult payload:', {
                result,
                category
            });

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
