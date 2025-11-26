const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const authRouter = require('./routes/auth');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://marketplace-hazel-delta-36.vercel.app/',
    credentials: true
}));
app.use(express.json());

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/auth', authRouter);

// Ruta raíz
app.get('/', (req, res) => {
    res.json({ message: 'API E-commerce funcionando' });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;