const { Schema, model, Types } = require('mongoose');
const schema = new Schema({
    // работаем с созданием нового пользователа у которого должен быть уникальный email
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // создаем уникальный массив для каждого пользователя если он прошел регистрацию, привязываемся к коллекции Link
    links: [{ type: Types.ObjectId, ref: 'Link' }]
});

module.exports = model('User', schema);