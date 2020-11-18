const { Schema, model, Types } = require('mongoose');
const { MODELS_REF_DISH } = require('../vars');
const schema = new Schema({
    restaraunt: { type: Types.ObjectId, ref: 'Restaraunt' },
    type: {type: String, required: true},
    timecooking: {type: String, required: true},
    diet: {type: String, required: false},
    rating: {type: Number, default: 0},
    discount: {type: Number, default: 0},
});

module.exports = model(MODELS_REF_DISH, schema);