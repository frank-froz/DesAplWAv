const { Category, Product, User } = require('./src/models');
const sequelize = require('./src/config/database');

async function seedDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida');

        // Sincronizar modelos para crear las tablas
        await sequelize.sync({ alter: true });
        console.log('Tablas sincronizadas');

        // Crear usuario administrador
        const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
        if (!adminExists) {
            await User.create({
                email: 'admin@example.com',
                password: 'admin123',
                name: 'Administrador',
                role: 'ADMIN'
            });
            console.log('Usuario administrador creado: admin@example.com / admin123');
        } else {
            console.log('Usuario administrador ya existe');
        }

        // Crear usuario cliente de prueba
        const customerExists = await User.findOne({ where: { email: 'customer@example.com' } });
        if (!customerExists) {
            await User.create({
                email: 'customer@example.com',
                password: 'customer123',
                name: 'Cliente',
                role: 'CUSTOMER'
            });
            console.log('Usuario cliente creado: customer@example.com / customer123');
        } else {
            console.log('Usuario cliente ya existe');
        }

        // Verificar si ya existen categorías
        const existingCategories = await Category.count();
        if (existingCategories === 0) {
            // Crear categorías de ejemplo
            const categories = await Category.bulkCreate([
                { name: 'Electrónicos', description: 'Dispositivos electrónicos y gadgets' },
                { name: 'Ropa', description: 'Ropa y accesorios' },
                { name: 'Hogar', description: 'Artículos para el hogar' },
                { name: 'Deportes', description: 'Equipamiento deportivo' },
                { name: 'Libros', description: 'Libros y material educativo' }
            ]);
            console.log('Categorías creadas:', categories.map(c => c.name));
        } else {
            console.log('Las categorías ya existen');
        }

        // Obtener todas las categorías
        const categories = await Category.findAll();

        // Obtener productos existentes y asignar categorías
        const products = await Product.findAll();
        if (products.length > 0) {
            // Asignar categorías a productos existentes de manera rotativa
            for (let i = 0; i < products.length; i++) {
                if (!products[i].categoryId) {
                    const categoryId = categories[i % categories.length].id;
                    await products[i].update({
                        categoryId,
                        imageUrl: products[i].imageUrl || `https://via.placeholder.com/400x300?text=${products[i].nombre.replace(/\s+/g, '+')}`
                    });
                }
            }
            console.log('Productos actualizados con categorías e imágenes');
        }

        console.log('Base de datos poblada exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('Error al poblar la base de datos:', error);
        process.exit(1);
    }
}

seedDatabase();