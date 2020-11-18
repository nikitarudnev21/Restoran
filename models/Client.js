const { Schema, model, Types } = require('mongoose');
const { MODELS_CLIENT, MODELS_REF_ORDER, MODELS_REF_CLIENT } = require('../vars');
const schema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    birth: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    idcode: { type: Number, required: true, unique: true },
    address: { type: String, required: true },
    telephone: { type: String, required: true, unique: true },
    role: { type: String, required: true, default: MODELS_CLIENT },
    carddata: { type: Array, required: false },
    orders: [{type: Types.ObjectId, ref: MODELS_REF_ORDER}]
});

module.exports = model(MODELS_REF_CLIENT, schema);