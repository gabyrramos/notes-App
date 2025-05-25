const express = require('express');
const app = express();
const indexRouter = require('./routes/index');
const notesRouter = require('./routes/notes');
const categoryRouter = require('./routes/categories');


app.use(express.json());
app.use('/', indexRouter);
app.use('/api/notes', notesRouter);
app.use('/api/categories', categoryRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
})

