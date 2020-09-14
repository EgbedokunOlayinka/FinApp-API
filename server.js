const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const routes = require('./routes/routes');

dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/api/v1', routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`));