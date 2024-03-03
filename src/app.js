const express = require('express');
const dotenv = require('dotenv');
const connect = require('./config/database.js')
const route = require('./routes/index.js')
const morgan = require('morgan');
dotenv.configDotenv(); 
const app = express();
connect();

app.use(express.json());
app.use(morgan());

app.get('/', (req, res) => {
    res.send('Welcome to the backend!');
});

route(app);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
