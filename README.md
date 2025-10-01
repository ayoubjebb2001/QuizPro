Contexte du projet
Après avoir construit un quiz dynamique côté front (HTML/JS) avec gestion des données locales, l’entreprise souhaite maintenant une version complète multi-utilisateurs reposant sur un vrai back-end.

L’objectif est d’introduire les concepts fondamentaux du développement full-stack (serveur, base de données, routes, sessions) qui sont nécessaires pour évoluer vers la stack MERN.

---

✍ Contraintes et Exigences Fonctionnelles
👥 Gestion des utilisateurs :

Création de compte (username + mot de passe).
Connexion / déconnexion avec sessions.
Rôles : Utilisateur (jouer au quiz) & Admin (gérer les questions).
🎯 Quiz dynamique connecté à la base MySQL :

Les questions et thématiques sont stockées en base (table questions).
Chaque partie jouée enregistre le résultat dans la table scores (score, date, utilisateur).
L’utilisateur voit son historique personnel (scores, thématiques jouées).
📊 Dashboard utilisateur :

Score moyen, nombre de parties jouées.
Classement global des meilleurs joueurs (top 5).
🛠️ Dashboard admin :

CRUD sur les questions (ajout, édition, suppression).
Visualisation des scores des utilisateurs.
👋 Bonus attendus :

Ajout d’un système de badges (par ex. : "Débutant", "Intermédiaire", "Expert").
---

🚨 Contraintes et Exigences Techniques
◼ Back-end en Node.js + Express :

Routes pour users, questions, scores.
Utilisation d’EJS pour générer des vues dynamiques.
Middleware pour vérifier le rôle utilisateur/admin.
◼ Base de données MySQL avec au moins 3 tables :

users (id, username, password hash, role).
questions (id, thematique, question, options, réponses correctes).
scores (id, user_id, thematique, score, date).
◼ Front intégré au back avec EJS :

Formulaires (login, inscription, quiz).
Affichage dynamique des questions et résultats.
◼ Sessions & Cookies :

Gestion de l’authentification et persistance de la connexion.
◼ Code structuré :

Routes, contrôleurs, models.
Bonne séparation front/back.
◼ Gestion des variables d’environnement

DataBase credentials
Secrets.