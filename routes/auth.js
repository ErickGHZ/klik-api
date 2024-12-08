const express = require('express');
const { login, register } = require('../controllers/authController');  // Verifica esta línea
const router = express.Router();

// Rutas para autenticación
router.post('/login', login);
router.post('/register', register);

module.exports = router;
