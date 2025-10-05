import userRepository from '../repositories/UserRepository.js';

class UserService {

    async getAll() {
        return userRepository.getAll();
    }

    async getById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        return {
            _id: user._id,
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            birthdate: user.birthdate,
            address: user.address,
            url_profile: user.url_profile,
            age: user.age,
            roles: user.roles.map(r => ({ _id: r._id, name: r.name })),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }

    async updateById(id, updateData) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }

        const updatedUser = await userRepository.updateById(id, updateData);
        return {
            _id: updatedUser._id,
            email: updatedUser.email,
            name: updatedUser.name,
            lastName: updatedUser.lastName,
            phoneNumber: updatedUser.phoneNumber,
            birthdate: updatedUser.birthdate,
            address: updatedUser.address,
            url_profile: updatedUser.url_profile,
            age: updatedUser.age,
            roles: updatedUser.roles.map(r => ({ _id: r._id, name: r.name })),
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        };
    }
}

export default new UserService();
