const app = require('./app');
const sequelize = require('./config/database');
const { Category, Product, User } = require('./models'); // Load models and associations
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida');

        await sequelize.sync();
        console.log('Modelos sincronizados');

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();