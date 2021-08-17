const express = require('express');
const mongoose = require('mongoose');
var app = express();
app.use(express.json());
require('dotenv').config();
const authRoutes = require('./routes/auth');

app.get('/', (req, res) => {
    res.send('Welcome to NEWDE SERVER');
});

app.use(process.env.API_AUTHENTIFICATION, authRoutes);
const port = process.env.PORT || 3000;

mongoose.connect(process.env.CONNECTION,
{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
})
.then(() => {
    app.listen(port, () => console.log(`Server is running on PORT = ${port}`));
})
.catch(err => console.log(err));