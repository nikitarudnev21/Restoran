const { Schema, model } = require('mongoose');
const { MODELS_ADMIN, MODELS_REF_ADMIN } = require('../vars');
const schema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    birth: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    idcode: { type: Number, required: true, unique: true },
    address: { type: String, required: true },
    telephone: { type: String, required: true, unique: true },
    role: { type: String, required: true, default: MODELS_ADMIN }
});

module.exports = model(MODELS_REF_ADMIN, schema);