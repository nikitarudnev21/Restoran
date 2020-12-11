const { Router } = require('express');
const shortid = require('shortid');
const auth = require('../middleware/auth.middleware');
const Admin = require('../models/Admin');
const Owner = require('../models/Owner');
const router = Router();

router.post('/apikeyuser', auth, async (req, res) => {
    try {
        const { id } = req.body
        const user = await Owner.findById(id);
        res.json({apikey:user.apikey}).status(200);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});

router.get('/', auth, async (req,res)=>{
    try {
        const apikeys = [];
        const admins = await Admin.find();
        admins.map(admin=>admin.apikeys.length && apikeys.push(admin.apikeys));
        res.json({apikeys: apikeys.flat()});
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});

router.post('/apikey', auth, async (req, res) => {
    try {
        const { id } = req.body;
        const user = await Admin.findById(id);
        const apikey = shortid.generate();
        user.apikeys = [...user.apikeys, {value: apikey, used: false}];
        await user.save();
        res.status(201).json({ apikey: {value: apikey, used: false}, message: "API Ключ создан" });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});

module.exports = router;