import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio.']
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es obligatorio.']
  },
  email: {
    type: String,
    required: [true, 'El correo es obligatorio.'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'El correo electrónico no es válido.']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria.'],
    minlength: [8, 'Debe tener al menos 8 caracteres.']
  },
  phoneNumber: {
    type: String,
    required: [true, 'El número de teléfono es obligatorio.'],
    minlength: [9, 'Debe tener al menos 9 caracteres.']
  },
  birthdate: {
    type: Date,
    required: [true, 'La fecha de nacimiento es obligatoria.']
  },
  address: {
    type: String,
    default: ''
  },
  url_profile: {
    type: String,
    default: ''
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true } 
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[#\$%&*@]).{8,}$/;
  if (!passwordRegex.test(this.password)) {
    return next(
      new Error(
        'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial (#, $, %, &, *, @).'
      )
    );
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.virtual('age').get(function () {
  if (!this.birthdate) return null;
  const diff = Date.now() - this.birthdate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
});

export default mongoose.model('User', UserSchema);
