const { Schema, model, Types } = require('mongoose');
const { MODELS_REF_OWNER, MODELS_REF_ORDER, MODELS_REF_RESTARAUNT } = require('../vars');
const schema = new Schema({
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    telephone: { type: String, required: true, unique: true },
    workers: { type: Array, required: true },
    owner: { type: Types.ObjectId, ref: MODELS_REF_OWNER},
    orders: [{type: Types.ObjectId, ref: MODELS_REF_ORDER}] 
});

module.exports = model(MODELS_REF_RESTARAUNT, schema);