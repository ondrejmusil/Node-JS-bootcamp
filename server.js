const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app');
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.NATOURS_DATABASE_PASSWORD);


process.on('uncaughtException', err => {
    console.log('UNHANDLED EXCEPTION! 💥 Shutting down...');
    process.exit(1);
});

mongoose.connect(DB, {
    useNewUrlParser: true
}).then(() => {
    console.log('DB connection successful');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    // finishes pending server requests etc. and then shuts down the app
    server.close(() => {
        process.exit(1);
    });
});