const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true,  // Añadimos la validación de unicidad
  },
  email: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true,  // Añadimos la validación de unicidad
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Por favor, ingresa un correo válido',
    ],
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
  },
}, { timestamps: true });

// Validar que los valores sean únicos antes de guardar en la base de datos
userSchema.index({ name: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
