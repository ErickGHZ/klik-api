const bcrypt = require('bcryptjs'); // Importar bcryptjs
const User = require('../models/user');

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

    const newUser = new User({ name, email, password: hashedPassword, });

    // Guardar en la base de datos
    await newUser.save();

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
    // Validación simple
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Aquí iría la comparación de la contraseña (con bcrypt si usas hashing)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    res.status(200).json({ message: 'Login exitoso', user });
  } catch (error) {
    console.error('Error al hacer login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

