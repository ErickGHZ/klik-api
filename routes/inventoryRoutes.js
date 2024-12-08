const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Obtener inventario por ID de usuario
router.get('/:userId', inventoryController.getInventory);

// Actualizar inventario por ID de usuario
router.put('/:userId', inventoryController.updateInventory);

module.exports = router;
