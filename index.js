import express from 'express';
import bodyParser from 'body-parser';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { config } from 'dotenv';

const app = express();
const port = 3000;

config();
const filename = "database.db";
console.log(filename);
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: filename
});

/**
 * Modelo que representa un libro en la base de datos.
 * 
 * @class Book
 * @extends {Model}
 */
class Book extends Model { }

Book.init({
    autor: DataTypes.STRING,
    isbn: DataTypes.INTEGER,
    editorial: DataTypes.STRING,
    paginas: DataTypes.INTEGER,
}, { sequelize, modelName: 'book' });

sequelize.sync();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Ruta para obtener todos los libros.
 * 
 * @route GET /books
 * @param {Request} req - La solicitud HTTP.
 * @param {Response} res - La respuesta HTTP.
 */
app.get('/books', async (req, res) => {
    const books = await Book.findAll();
    res.json(books);
});

/**
 * Ruta para obtener un libro por ID.
 * 
 * @route GET /books/:id
 * @param {Request} req - La solicitud HTTP.
 * @param {Response} res - La respuesta HTTP.
 */
app.get('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.json(book);
});

/**
 * Ruta para crear un nuevo libro.
 * 
 * @route POST /books
 * @param {Request} req - La solicitud HTTP.
 * @param {Response} res - La respuesta HTTP.
 */
app.post('/books', async (req, res) => {
    const book = await Book.create(req.body);
    res.json(book);
});

/**
 * Ruta para actualizar un libro por ID.
 * 
 * @route PUT /books/:id
 * @param {Request} req - La solicitud HTTP.
 * @param {Response} res - La respuesta HTTP.
 */
app.put('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.update(req.body);
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

/**
 * Ruta para eliminar un libro por ID.
 * 
 * @route DELETE /books/:id
 * @param {Request} req - La solicitud HTTP.
 * @param {Response} res - La respuesta HTTP.
 */
app.delete('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.json({ message: 'Book deleted' });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

/**
 * Inicia el servidor y escucha en el puerto especificado.
 * 
 * @param {number} port - El puerto en el que el servidor escucha.
 */
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
