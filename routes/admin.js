const express = require('express');
const router = express.Router();
const AdminController = require('../Controllers/AdminController');
const admin = require('../middlewares/admin');

/**
 * Admin Routes
 * All routes require admin authentication
 */

// GET /admin/users - Display all users with their scores
router.get('/users', admin, AdminController.showUsers);

module.exports = router;
