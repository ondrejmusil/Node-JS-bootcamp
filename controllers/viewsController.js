const Tour = require('../models/tourModel.js');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
    // 1) Get tour data from collection
    const tours = await Tour.find({});

    // 2) Build template
    // 3) Render the template using tour data
    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    });
});

exports.getTour = catchAsync(async (req, res) => {
    // 1) Get tour data
    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
    });

    // 2) Build template
    // 3) Render the template using tour data
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
    });
});

exports.getLoginForm = async (req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account'
    });
};