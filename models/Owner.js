const { Schema, model } = require('mongoose');
const { MODELS_OWNER, MODELS_REF_OWNER } = require('../vars');
const schema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    birth: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    idcode: { type: Number, required: true, unique: true, maxlength: 11 },
    address: { type: String, required: true },
    telephone: { type: String, required: true, unique: true },
    apikey: { type: String, required: true, unique: true },
    restaraunts: { type: Array, required: true, max: 5 },
    role: { type: String, required: true, default: MODELS_OWNER },
    carddata: { type: Array, required: false }
});

module.exports = model(MODELS_REF_OWNER, schema);