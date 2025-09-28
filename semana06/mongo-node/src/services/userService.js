import userRepository from "../repositories/userRepository.js";

class UserService {
    async createUser(userData) {
        return await userRepository.create(userData);
    }

    async getUsers() {
        return await userRepository.findAll();
    }

    async getUserById(userId) {
        return await userRepository.findById(userId);
    }

    async updateUser(userId, userData) {
        return await userRepository.update(userId, userData);
    }

    async deleteUser(userId) {
        return await userRepository.delete(userId);
    }
}

export default new UserService();