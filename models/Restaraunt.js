const { Schema, model, Types } = require('mongoose');
const { MODELS_REF_OWNER, MODELS_REF_ORDER, MODELS_REF_RESTARAUNT } = require('../vars');
const schema = new Schema({
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    telephone: { type: String, required: true, unique: true },
    workers: [{type: Types.ObjectId}],
    owner: { type: Types.ObjectId, ref: MODELS_REF_OWNER},
    ownername: {type: String, required: true},
    orders: [{type: Types.ObjectId, ref: MODELS_REF_ORDER}] 
});

module.exports = model(MODELS_REF_RESTARAUNT, schema);