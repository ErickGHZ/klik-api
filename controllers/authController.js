const bcrypt = require('bcryptjs'); // Importar bcryptjs
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Inventory = require('../models/Inventory'); 

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verificar si el nombre ya está registrado
    const existingName = await User.findOne({ name });
    if (existingName) {
      return res.status(400).json({
        message: 'El nombre ya está registrado',
      });
    }

    // Verificar si el correo ya está registrado
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: 'El correo ya está registrado',
      });
    }

    // Crear un nuevo usuario
    const salt = await bcrypt.genSalt(10); // Generar un "salt" para la encriptación
    const hashedPassword = await bcrypt.hash(password, salt); // Encriptar la contraseña

    // Guardar en la base de datos
    const newUser = new User({ name, email, password: hashedPassword, });
    await newUser.save();

    // Crear el inventario asociado
    const newInventory = new Inventory({ userId: newUser._id });
    await newInventory.save();


    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: { id: newUser._id, name, email },
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario por email o nombre de usuario (name)
    const user = await User.findOne({ $or: [{ email }, { name: email }] });

    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Comparación de la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Crear JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Obtener el inventario del usuario
    const inventory = await Inventory.findOne({ userId: user._id });
    if (!inventory) {
      return res.status(400).json({ message: 'Inventario no encontrado' });
    }

    // Responder con token y el inventario
    res.status(200).json({
      message: 'Login exitoso',
      token,
      inventory,  // Enviar el inventario junto con el token
    });
  } catch (error) {
    console.error('Error al hacer login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};



