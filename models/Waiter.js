const { Schema, model, Types } = require('mongoose');
const { MODELS_WAITER, MODELS_REF_RESTARAUNT, MODELS_REF_OWNER, MODELS_REF_WAITER } = require('../vars');
const schema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    birth: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    idcode: { type: Number, required: true, unique: true },
    address: { type: String, required: true },
    telephone: { type: String, required: true, unique: true },
    role: { type: String, required: true, default: MODELS_WAITER },
    restaraunt: { type: Types.ObjectId, ref: MODELS_REF_RESTARAUNT },
    owner: { type: Types.ObjectId, ref: MODELS_REF_OWNER } 
});

module.exports = model(MODELS_REF_WAITER, schema);