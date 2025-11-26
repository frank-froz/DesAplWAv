const Product = require('./Products');
const Category = require('./Categories');
const User = require('./User');

// Associations
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

module.exports = {
    Product,
    Category,
    User
};