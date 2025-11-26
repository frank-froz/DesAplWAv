const { Category } = require('../models');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json({
            success: true,
            message: 'Categorías obtenidas correctamente',
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener categorías',
            data: null
        });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada',
                data: null
            });
        }
        res.json({
            success: true,
            message: 'Categoría obtenida correctamente',
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener categoría',
            data: null
        });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Categoría creada correctamente',
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear categoría',
            data: null
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const [updated] = await Category.update(req.body, {
            where: { id: req.params.id }
        });
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada',
                data: null
            });
        }
        const updatedCategory = await Category.findByPk(req.params.id);
        res.json({
            success: true,
            message: 'Categoría actualizada correctamente',
            data: updatedCategory
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar categoría',
            data: null
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const deleted = await Category.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada',
                data: null
            });
        }
        res.json({
            success: true,
            message: 'Categoría eliminada correctamente',
            data: null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar categoría',
            data: null
        });
    }
};