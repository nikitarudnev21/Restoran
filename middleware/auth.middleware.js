// next -позволяет продолжить выполнение запроса
const jwt = require('jsonwebtoken');
const config = require('config');
module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') { // если метод не get или post
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; // передаем с фронтенда, пример строки: Bearer TOKEN
        if (!token) {
            return res.status(401).json({ message: 'Нет авторизации' });
        }
        // декодируем токен
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded;
        next();
    } catch (e) {
        res.status(401).json({ message: 'Нет авторизации' });
    }
}