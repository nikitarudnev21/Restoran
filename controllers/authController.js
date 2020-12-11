const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Owner = require('../models/Owner');
const Waiter = require('../models/Waiter');
const Client = require('../models/Client');
const Cook = require('../models/Cook');
const config = require('config');
const { MODELS_REF_ADMIN, MODELS_REF_CLIENT, MODELS_REF_COOK, MODELS_REF_OWNER, MODELS_REF_WAITER } = require('../vars');
const ALL_REFS = [MODELS_REF_ADMIN, MODELS_REF_CLIENT, MODELS_REF_OWNER, MODELS_REF_COOK, MODELS_REF_WAITER];
const router = Router();
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

router.post('/apikey',
    async (req, res) => {
        try {
            const apikey = req.body.key;
            const cursor = Admin.find().cursor();
            let keyFounded = false;
            let foundedkey = {};
            let duplicate = false;
            for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
                if (doc.apikeys.length && typeof doc.apikeys !== null) {
                    doc.apikeys.filter(Boolean).map(key=>{
                        if (key.value===apikey) {
                            if (!key.used) {
                                keyFounded = true;
                                foundedkey = key;
                            }
                            else{
                                duplicate = true;
                            }
                        }
                    })
                }
                
                if (Object.keys(foundedkey).length) {
                    const user = await Admin.findOne({email:doc.email});
                    if (Array.isArray(user.apikeys) && keyFounded && Object.keys(foundedkey).length) {
                        if (user.apikeys.length) {
                            user.apikeys.filter(Boolean).map(async (key,i)=>{
                                if (key.value===foundedkey.value) {
                                    user.apikeys[i] = {...foundedkey, used: true };
                                     await Admin.findOneAndUpdate({email: doc.email}, {apikeys: user.apikeys}).lean();
                                }
                            })
                        }
                    }
                }
            }
            if (duplicate) {
                return res.json({message:"Этот ключ уже используеться"});
            }
            keyFounded ? res.json({message:"Правильный ключ, можете продолжить регистрацию", keyFounded, key: apikey}) : res.status(400).json({message:"Неверный ключ"})
        } catch (e) {
            console.log(e.message);
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
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) { 
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при регистрации'
                });
            }

            const { email, password, role, firstname, lastname, birthdayDate, idcode, address, telephone  } = req.body;
            let candidate;
            let hashedPassword;
            let user;
            switch (role) {
                case MODELS_REF_ADMIN:
                    candidate = await Admin.findOne({ email });
                    if (candidate) {
                        return res.status(400).json({ message: 'Такой пользователь уже существует' });
                    }
                    hashedPassword = await bcrypt.hash(password, 12);
                    user = new Admin({ email, password: hashedPassword, firstname, lastname, birth: birthdayDate, idcode, address, telephone, role });
                    await user.save();
                    res.status(201).json({ message: 'Пользователь создан' });
                    break;
                case MODELS_REF_CLIENT:
                    break;
                case MODELS_REF_COOK:
                    break;
                case MODELS_REF_OWNER:
                    candidate = await Owner.findOne({ email });
                    if (candidate) {
                        return res.status(400).json({ message: 'Такой пользователь уже существует' });
                    }
                    hashedPassword = await bcrypt.hash(password, 12);
                    user = new Owner({ email, password: hashedPassword, firstname, lastname, birth: birthdayDate, idcode, address, telephone, role, apikey: req.body.key });
                    await user.save();
                    res.status(201).json({ message: 'Пользователь создан' });
                    break;
                case MODELS_REF_WAITER:
                    break;
                default:
                    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
                    break;
            }
        } catch (e) {
            console.log(e.message);
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
        }
    });

router.post(
    '/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        console.time('as');
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при входе в систему'
                });
            }

            const { email, password } = req.body
            let users = [];
            const login = async user =>{
                users.push(user);
                if (!users.filter(Boolean).length && users.length === ALL_REFS.length) {
                    return res.status(400).json({ message: 'Пользователь не найден' });
                }
                    isMatch = await bcrypt.compare(password, user.password);
                    if (!isMatch) {
                        return res.status(400).json({ message: 'Неверный пароль попробуйте снова' });
                    }
                    token = jwt.sign(
                        { userId: user.id },
                        config.get('jwtSecret'),
                        { expiresIn: '1h' } 
                    );
                    return res.json({ token, userId: user.id, message: 'Вы зашли в систему',
                     name: user.firstname + " " + user.lastname, role:user.role });
            }

            ALL_REFS.map(async ref =>{
                switch (ref) {
                    case MODELS_REF_ADMIN:
                        login(await Admin.findOne({ email }));
                    break;
                    case MODELS_REF_WAITER:
                        login(await Waiter.findOne({ email }));
                    break;
                    case MODELS_REF_COOK:
                       login(await Cook.findOne({ email }));
                    break;
                    case MODELS_REF_CLIENT:
                        login(await Client.findOne({ email }));
                    break;
                    case MODELS_REF_OWNER:
                        login(await Owner.findOne({ email }));
                    default:
                        break;
                }
                users = [];
            })
            console.timeEnd('as');
        } catch (e) {
            console.log(e.message);
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
        }
    }
);


module.exports = router;