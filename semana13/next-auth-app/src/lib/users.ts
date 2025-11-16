import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin'; // Rol del usuario
}

const users: User[] = [];

export const findUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

export const createUser = async (email: string, password: string, name: string): Promise<User> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user: User = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    name,
    role: 'user', // Por defecto todos son 'user'
  };
  users.push(user);
  return user;
};

export const validatePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};