import User from "../models/User.js";

class UserRepository {
    async create(user) {
        return await User.create(user);
    }

    async findAll() {
        return await User.find();
    }

    async findById(id) {
        return await User.findById(id);
    }

    async update(userId, userData) {
        return await User.findByIdAndUpdate(userId, userData, { new: true });
    }

    async delete(userId) {
        return await User.findByIdAndDelete(userId);
    }
}

export default new UserRepository();