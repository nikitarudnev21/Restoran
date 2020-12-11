const { Schema, model, Types } = require('mongoose');
const { MODELS_REF_ORDER } = require('../vars');
const schema = new Schema({
    restaraunt: { type: Types.ObjectId, ref: 'Restaraunt' },
    dishes: [{type: Types.ObjectId, ref: 'Dish'}],
    tablenumber: {type: Number, required: true},
    status: {type: String, required: true},
    datetime: {type: String, required: true, default: Date.now},
    price: {type: String, required: true, default: "0"}
});

module.exports = model(MODELS_REF_ORDER, schema);