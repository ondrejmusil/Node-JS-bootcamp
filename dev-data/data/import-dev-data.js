/*
Custom script for importing data into DB
NOT a part of rest of the implementation process
 */

const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.NATOURS_DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true
}).then(() => {
    console.log('DB connection successful');
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

const deleteData = async () => {
    try {
        await Tour.deleteMany({});
        await User.deleteMany({});
        await Review.deleteMany({});

        console.log('All DB data deleted');
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false});
        await Review.create(reviews);

        console.log('All data imported - DONE!');
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

