const express = require('express');
const app = express();
const cors = require('cors');
const indexRouter = require('./routes/index');
const notesRouter = require('./routes/notes');
const categoryRouter = require('./routes/categories');

app.use(cors({
    origin: 'http://localhost:3001', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use(express.json());
app.use('/', indexRouter);
app.use('/api/notes', notesRouter);
app.use('/api/categories', categoryRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
})

