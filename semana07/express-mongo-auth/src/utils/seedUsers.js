import bcrypt from 'bcrypt';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

export default async function seedUsers() {
  let adminRole = await roleRepository.findByName('admin');
  if (!adminRole) {
    adminRole = await roleRepository.create({ name: 'admin' });
  }

  let userRole = await roleRepository.findByName('user');
  if (!userRole) {
    userRole = await roleRepository.create({ name: 'user' });
  }

  // Recrear usuario admin siempre para asegurar contraseña correcta
  const adminEmail = 'admin@gmail.com';
  const existingAdmin = await userRepository.findByEmail(adminEmail);
  if (existingAdmin) {
    await userRepository.deleteById(existingAdmin._id);
    console.log('Usuario admin existente eliminado para recrear');
  }

  const adminUser = {
    name: 'Admin',
    lastName: 'Principal',
    email: adminEmail,
    password: 'Admin#123', // Se hasheará automáticamente por el pre-save hook
    phoneNumber: '+51999999999',
    birthdate: new Date('1990-01-01'),
    address: 'Av. Principal 123, Lima',
    url_profile: 'https://cdn-icons-png.flaticon.com/512/711/711769.png',
    roles: [adminRole._id]
  };

  await userRepository.create(adminUser);
  console.log('Usuario admin creado: admin@gmail.com / Admin#123');

  // Recrear usuario de prueba siempre
  const testUserEmail = 'user@gmail.com';
  const existingUser = await userRepository.findByEmail(testUserEmail);
  if (existingUser) {
    await userRepository.deleteById(existingUser._id);
    console.log('Usuario de prueba existente eliminado para recrear');
  }

  const testUser = {
    name: 'Usuario',
    lastName: 'Prueba',
    email: testUserEmail,
    password: 'User#123', 
    phoneNumber: '+51987654321',
    birthdate: new Date('1995-05-15'),
    address: 'Calle Secundaria 456, Lima',
    url_profile: 'https://cdn-icons-png.flaticon.com/512/711/711769.png',
    roles: [userRole._id]
  };

  await userRepository.create(testUser);
  console.log('Usuario de prueba creado');
}
