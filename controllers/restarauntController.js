const { Router } = require('express');
const router = Router();
const auth = require('../middleware/auth.middleware');
const Owner = require('../models/Owner');
const Restaraunt = require('../models/Restaraunt');
const { MODELS_REF_ADMIN, MODELS_REF_OWNER } = require('../vars');


router.post('/', auth, async (req, res) => {
    try {
        const { id, role } = req.body
        if (role===MODELS_REF_OWNER) {
            const restaraunts = await Restaraunt.find({owner: id});
            return res.json({restaraunts}).status(200);
        }
        else if(role === MODELS_REF_ADMIN){
            const restaraunts = await Restaraunt.find();
            return res.json({restaraunts}).status(200);
        }
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});

router.post('/create', auth,
    async (req, res) => {
        try {
            const {name, address, telephone, id, username} = req.body;
            const candidate = await Restaraunt.findOne({ name, address, telephone });
            if (candidate) {
                return res.status(400).json({ message: 'Такой ресторан уже существует' });
            }
            const restoran = new Restaraunt({
                name, address, telephone, owner: id, ownername: username, orders: []
            });
            await restoran.save();
            const restoranOwner = await Owner.findById(id)
            console.log(restoranOwner);
            restoranOwner.restaraunts = [...restoranOwner.restaraunts, restoran._id];
            await restoranOwner.save();
            res.json({message:"Ресторан создан"}).status(200)
        } catch (e) {
            console.log(e.message);
            res.status(400).json({message:"Что-то пошло не так"})
        }
    }
);


router.get('/:id', auth, async (req, res) => {
    try {
        const link = await Restaraunt.findById(req.params.id).lean();
        res.json(link);
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});

router.delete('/delete/:id', auth, async (req, res) => {
    try {
        await Restaraunt.findByIdAndDelete(req.params.id).lean();
        const owner = await Owner.findById(req.body.ownerId);
        owner.restaraunts = owner.restaraunts.filter(rest=>rest.toString() !== req.params.id)
        await owner.save();
        res.json({ message: 'Ресторан был успешо удален' });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});


router.patch('/edit/:id', auth, async (req, res) => {
    console.time('as');
    try {
        const restaraunt = await Restaraunt.findOneAndUpdate({ _id: req.params.id },
        { ...req.body.restaraunt }, { new: true }).lean();
        return res.json({ message: 'Ресторан был успешо изменен', restaraunt, edited: true });
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова', edited: false });
    }
    console.timeEnd('as');
});

router.delete('/deleteall', auth, async (req, res) => {
    const {ownerId, role} = req.body;    
    try {
        if (role===MODELS_REF_OWNER) {
            await Restaraunt.deleteMany({ owner: ownerId }).lean();
            const owner = await Owner.findById(ownerId);
            owner.restaraunts = [];
            owner.save();
            return res.json({ message: "Все рестораны были удалены", deleted: true });
        }
        else{
            await Restaraunt.deleteMany();
            const owners = await Owner.find();
            owners.map(async owner=>{
                owner.restaraunts = [];
                await owner.save();
            })
            return res.json({ message: "Все рестораны были удалены", deleted: true });
        }
       
    } catch (e) {
        res.status(404).json({ message: "Что-то пошло не так", deleted: false });
    }
});



module.exports = router;

