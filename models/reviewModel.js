const mongoose = require('mongoose');
const Tour = require('./../models/tourModel.js');

const reviewSchema = new mongoose.Schema({
        review: {
            type: String,
            required: [true, 'A review must have a review property.']
        },
        rating: {
            type: Number,
            enum: {
                values: [0, 1, 2, 3, 4, 5],
                message: 'Rating must be in range from 0 - 5.'
            },
            required: [true, 'A review must have a rating']
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        tour: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Tour',
                required: [true, 'Review must belong to a tour.']
            }
        ],
        user: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: [true, 'Review must belong to a user.']
            }
        ]
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    });

// Each tour can have only 1 review from a user
reviewSchema.index({tour: 1, user: 1}, {
    unique: true
});

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    });

    next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: {tour: tourId}
        },
        {
            $group: {
                _id: '$tour',
                nRating: {$sum: 1},
                avgRating: {$avg: '$rating'}
            }
        }
    ]);

    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }
}

reviewSchema.post('save', function () {
    this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.clone().findOne();
    next();
});

reviewSchema.post(/^findOneAnd/, async function (next) {
    await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;