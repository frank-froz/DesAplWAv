import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

class AuthService {

    async signUp({ email, password, name, lastName, phoneNumber, birthdate, address, url_profile, roles = ['user'] }) {
        const existing = await userRepository.findByEmail(email);
        if (existing) {
            const err = new Error('El email ya se encuentra en uso');
            err.status = 400;
            throw err;
        }

        // Asignar los role ids
        const roleDocs = [];
        for (const r of roles) {
            let roleDoc = await roleRepository.findByName(r);
            if (!roleDoc) roleDoc = await roleRepository.create({ name: r });
            roleDocs.push(roleDoc._id);
        }

        // Crear usuario (la contraseña se hasheará automáticamente por el pre-save hook)
        const userData = {
            email,
            password, // Se hashea en el modelo
            name,
            lastName,
            phoneNumber,
            birthdate: new Date(birthdate),
            address: address || '',
            url_profile: url_profile || '',
            roles: roleDocs
        };

        const user = await userRepository.create(userData);

        return {
            message: 'Usuario registrado exitosamente',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                lastName: user.lastName
            }
        };
    }

    async signIn({ email, password }) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            const err = new Error('Credenciales inválidas');
            err.status = 401;
            throw err;
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            const err = new Error('Credenciales inválidas');
            err.status = 401;
            throw err;
        }

        const token = jwt.sign({ 
            sub: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles.map(r => r.name) 
        }, 
        process.env.JWT_SECRET, 
        { 
            expiresIn: process.env.JWT_EXPIRES_IN || '1h' 
        });

        return { token };
    }
}

export default new AuthService();