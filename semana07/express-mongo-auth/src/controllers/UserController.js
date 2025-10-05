import userService from '../services/UserService.js';

class UserController {

    async getAll(req, res, next) {
        try {
            const users = await userService.getAll();
            res.status(200).json(users);
        } catch (err) {
            next(err);
        }
    }

    async getMe(req, res, next) {
        try {
            const user = await userService.getById(req.userId);
            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    }

    async updateMe(req, res, next) {
        try {
            const userId = req.userId;
            const updateData = req.body;
            
            // Campos permitidos para actualizar (excluimos email, password, roles)
            const allowedFields = ['name', 'lastName', 'phoneNumber', 'address', 'url_profile'];
            const filteredData = {};
            
            allowedFields.forEach(field => {
                if (updateData[field] !== undefined) {
                    filteredData[field] = updateData[field];
                }
            });

            if (Object.keys(filteredData).length === 0) {
                return res.status(400).json({ message: 'No se proporcionaron campos válidos para actualizar' });
            }

            const updatedUser = await userService.updateById(userId, filteredData);
            res.status(200).json({ 
                message: 'Perfil actualizado exitosamente',
                user: updatedUser 
            });
        } catch (err) {
            next(err);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await userService.getById(id);
            
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            
            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    }
}

export default new UserController();