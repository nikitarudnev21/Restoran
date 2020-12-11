const { Router } = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth.middleware');
const Admin = require('../models/Admin');
const Client = require('../models/Client');
const Cook = require('../models/Cook');
const { db } = require('../models/Owner');
const Owner = require('../models/Owner');
const Restaraunt = require('../models/Restaraunt');
const Waiter = require('../models/Waiter');
const router = Router();

router.get('/', auth, async (req, res) => {
    try {
        const collections = [await Admin.find(), await Owner.find(), await Cook.find(), await Client.find(), await Waiter.find()]
        .filter(collection=>collection.length);
        res.json({users: collections.flat()});
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});

router.delete('/delete/:id', auth, async (req, res) => {
    const {role, email, id} = req.body;
    try {
        await mongoose.connection.db.listCollections().toArray(function (err, names) {
            names.map(async (name,_,arr)=>{
                const user = await db.collection(name.name).findOneAndDelete({role, email });
                if (user.value) {
                    await Restaraunt.deleteMany({owner:id});
                    return res.json({ message: 'Пользователь был успешно удален' });
                }
            });
        });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});


router.patch('/edit/:id', auth, async (req, res) => {
    console.time('as');
    try {
        await mongoose.connection.db.listCollections().toArray(function (err, names) {
            names.map(async (name,_,arr)=>{
                const user = await db.collection(name.name).findOneAndUpdate({_id: req.params.id });
                if (user) {
                    return res.json({ message: 'Пользователь был успешо изменен', user, edited: true });
                }
            });
        });
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова', edited: false });
    }
    console.timeEnd('as');
});

router.delete('/deleteall', auth, async (req, res) => {
    try {
        await Admin.deleteMany();
        await Owner.deleteMany();
        await Client.deleteMany();
        await Waiter.deleteMany();
        await Cook.deleteMany();
        return res.json({ message: "Все пользователи были удалены", deleted: true });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});


module.exports = router;