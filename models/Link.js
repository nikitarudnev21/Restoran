const { Schema, model, Types } = require('mongoose');
const schema = new Schema({
    // откуда идет данная ссылка (пользователь отправил с фронта)
    from: { type: String, required: true },
    // уникальный адрес по которому мы будем сокращать ссылку
    to: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    clicks: { type: Number, default: 0 },
    owner: { type: Types.ObjectId, ref: 'User' }
});

module.exports = model('Link', schema);