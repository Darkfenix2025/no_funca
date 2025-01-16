const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de Sequelize para SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'legalito.db',
});

// Definir modelo para la tabla Contact
const Contact = sequelize.define('Contact', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    telefono: { type: DataTypes.STRING },
    consulta: { type: DataTypes.TEXT, allowNull: false },
    fecha: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
});

// Sincronizar la base de datos
sequelize.sync()
    .then(() => console.log('Base de datos SQLite sincronizada'))
    .catch(err => console.error('Error al sincronizar la base de datos:', err));

// Endpoint para guardar datos del formulario de contacto
app.post('/api/contact', async (req, res) => {
    try {
        const { nombre, email, telefono, consulta } = req.body;
        await Contact.create({ nombre, email, telefono, consulta });
        res.status(201).json({ message: 'Consulta guardada con éxito' });
    } catch (error) {
        console.error('Error al guardar la consulta:', error);
        res.status(500).json({ error: 'Error al guardar la consulta' });
    }
});

module.exports = app;
