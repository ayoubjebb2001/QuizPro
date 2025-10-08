const db = require('../config/database');

/**
 * DashboardController aggregates per-user stats and global leaderboard data.
 * Data points returned:
 *  - avgScore: average percentage score of the user (0 if none)
 *  - gamesPlayed: total number of quiz attempts by user
 *  - recentScores: last 5 scores with category & date
 *  - categoryBreakdown: per category: attempts, best, average
 *  - globalLeaderboard: top 5 users by average score (min 3 games)
 *  - globalRank: rank position of current user (null if no games)
 */
class DashboardController {
    static async getData(userId) {
        // Return defaults early if no userId
        if (!userId) {
            return {
                avgScore: 0,
                gamesPlayed: 0,
                recentScores: [],
                categoryBreakdown: [],
                globalLeaderboard: [],
                globalRank: null
            };
        }

        try {
            const [userAgg] = await queryPromise(`
				SELECT 
					COUNT(*) AS gamesPlayed,
					IFNULL(AVG(score),0) AS avgRaw
				FROM scores
				WHERE user_id = ?
			`, [userId]);

            const recentScores = await queryPromise(`
				SELECT s.id, s.score, s.category_id, DATE_FORMAT(s.taken_at, '%Y-%m-%d %H:%i') as played_at,
							 c.NAME as category_name
				FROM scores s
				JOIN categories c ON c.id = s.category_id
				WHERE s.user_id = ?
				ORDER BY s.taken_at DESC
				LIMIT 5
			`, [userId]);

            const categoryBreakdown = await queryPromise(`
				SELECT 
					c.id as category_id,
					c.NAME as category_name,
					COUNT(s.id) as attempts,
					IFNULL(ROUND(AVG(s.score),2),0) as avgScore,
					IFNULL(MAX(s.score),0) as bestScore
				FROM categories c
				LEFT JOIN scores s ON s.category_id = c.id AND s.user_id = ?
				GROUP BY c.id, c.NAME
				ORDER BY c.NAME ASC
			`, [userId]);

            const globalLeaderboard = await queryPromise(`
				SELECT 
					u.id,
					u.username,
					COUNT(s.id) as gamesPlayed,
					ROUND(AVG(s.score),2) as avgScore
				FROM users u
				JOIN scores s ON s.user_id = u.id
				GROUP BY u.id, u.username
				HAVING gamesPlayed >= 3
				ORDER BY avgScore DESC, gamesPlayed DESC
				LIMIT 5
			`, []);

            const rankRow = await queryPromise(`
				SELECT * FROM (
					SELECT 
						u.id,
						u.username,
                        COUNT(s.id) as gamesPlayed,
						ROUND(AVG(s.score),2) as avgScore,
						DENSE_RANK() OVER (ORDER BY AVG(s.score) DESC) as rnk
					FROM users u
					JOIN scores s ON s.user_id = u.id
					GROUP BY u.id, u.username HAVING gamesPlayed >= 3
				) ranked
				WHERE id = ?
			`, [userId]);

            const globalRank = rankRow.length ? rankRow[0].rnk : null;

            return {
                avgScore: userAgg ? Number(userAgg.avgRaw).toFixed(1) : '0.0',
                gamesPlayed: userAgg ? userAgg.gamesPlayed : 0,
                recentScores: recentScores.map(r => ({
                    id: r.id,
                    score: r.score,
                    category: r.category_name,
                    played_at: r.played_at
                })),
                categoryBreakdown: categoryBreakdown.map(c => ({
                    category_id: c.category_id,
                    category: c.category_name,
                    attempts: c.attempts,
                    average: c.avgScore,
                    best: c.bestScore
                })),
                globalLeaderboard: globalLeaderboard.map((g, idx) => ({
                    rank: idx + 1,
                    user_id: g.id,
                    username: g.username,
                    avgScore: g.avgScore,
                    gamesPlayed: g.gamesPlayed
                })),
                globalRank
            };
        } catch (err) {
            console.error('Dashboard aggregation error:', err);
            return {
                avgScore: 0,
                gamesPlayed: 0,
                recentScores: [],
                categoryBreakdown: [],
                globalLeaderboard: [],
                globalRank: null,
                error: 'Unable to load dashboard data'
            };
        }
    }
}

function queryPromise(sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

module.exports = DashboardController;
