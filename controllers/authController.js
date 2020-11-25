const { Router } = require('express');
const bcrypt = require('bcryptjs'); // библиотека позволяет хешировать пароли и сравнивать их
const { check, validationResult } = require('express-validator');// позволяет валидировать данные отправленные пользователем
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const config = require('config');
const { MODELS_REF_ADMIN, MODELS_REF_CLIENT, MODELS_REF_COOK, MODELS_REF_OWNER, MODELS_REF_WAITER } = require('../vars');
const router = Router();

// /api/auth/register

router.post('/secretkey',
    async (req, res) => {
        try {
            if (req.body.key===config.get("secretKey")) {
                res.status(200).json({conf:config.get("secretKey")})
            }
            else{
                res.status(400).json({message:"Неверный ключ"})
            }
        } catch (e) {
            res.status(400).json({message:"Что-то пошло не так"})
        }
    }
);

router.post(
    '/register',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длинна пароля 6 символов').isLength({
            min: 6,
            max: 40
        })
    ],
    async (req, res) => {
        console.log(req.body);
        try {
            const errors = validationResult(req); // валидируем входящие поля
            if (!errors.isEmpty()) { // если есть ошибки в валидации
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при регистрации'
                });
            }

            const { email, password, role } = req.body;
            switch (role) {
                case MODELS_REF_ADMIN:
                    const candidate = await Admin.findOne({ email });
                    if (candidate) {
                        return res.status(400).json({ message: 'Такой пользователь уже существует' });
                    }
                    const hashedPassword = await bcrypt.hash(password, 12);
                    const user = new Admin({ email, password: hashedPassword });
                    await user.save();
                    res.status(201).json({ message: 'Пользователь создан' });
                    break;
                case MODELS_REF_CLIENT:
                    break;
                case MODELS_REF_COOK:
                    break;
                case MODELS_REF_OWNER:
                    break;
                case MODELS_REF_WAITER:
                    break;
                default:
                    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
                    break;
            }
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
        }
    });

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        console.time('as');
        try {
            const errors = validationResult(req); // валидируем входящие поля
            if (!errors.isEmpty()) { // если есть ошибки в валидации
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при входе в систему'
                });
            }

            const { email, password } = req.body

            // пытаемся найти пользователя по эмайлу который ввел пользователь
            const user = await Admin.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Пользователь не найден' });
            }
            // если дошли до сюда то мы нашли пользователя

            // проверяем ввел ли пользователь правильный пароль
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Неверный пароль попробуйте снова' });
            }

            // делаем авторизацию по jwt токену
            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                // через сколько jwt token закончит свое существование
                { expiresIn: '1h' }
            );
            res.json({ token, userId: user.id, message: 'Вы зашли в систему' });
            console.timeEnd('as');
        } catch (e) {
            // 500 статус = серверная ошибка
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
        }
    }
);


module.exports = router;