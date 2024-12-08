const Inventory = require('../models/Inventory');

exports.getInventory = async (req, res) => {
  const { userId } = req.params;

  try {
    const inventory = await Inventory.findOne({ userId });
    if (!inventory) {
      return res.status(404).json({ message: 'Inventario no encontrado' });
    }

    res.status(200).json({ inventory });
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.updateInventory = async (req, res) => {
  const { userId } = req.params;
  const { coins, diamonds, level, exp } = req.body;

  try {
    const inventory = await Inventory.findOne({ userId });
    if (!inventory) {
      return res.status(404).json({ message: 'Inventario no encontrado' });
    }

    // Actualizar solo los campos proporcionados
    if (coins !== undefined) inventory.coins = coins;
    if (diamonds !== undefined) inventory.diamonds = diamonds;
    if (level !== undefined) inventory.level = level;
    if (exp !== undefined) inventory.exp = exp;

    await inventory.save();
    res.status(200).json({ message: 'Inventario actualizado', inventory });
  } catch (error) {
    console.error('Error al actualizar inventario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
