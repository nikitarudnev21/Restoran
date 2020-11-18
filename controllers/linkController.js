const { Router } = require('express');
const Link = require('../models/Link');
const auth = require('../middleware/auth.middleware');
const config = require('config');
const shortid = require('shortid');
const User = require('../models/User');
const router = Router();

// генерируем новую ссылку
router.post('/generate', auth, async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl'); // получаем url из конфига по которому будет делать запрос post
        const { from } = req.body;
        // генерируем уникальный код для ссылки
        const code = shortid.generate();

        // если ссылка существует уже существует
        /*  const existing = await Link.findOne({ from }).lean();
          if (existing) {
              return res.json({ message: "Такая ссылка уже существует" });
          }*/

        const to = baseUrl + '/t/' + code;
        const link = new Link({
            code, to, from, owner: req.user.userId
        });
        await link.save();
        res.status(201).json({ link }); // 201 это статус - created
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});

// получение всех ссылок конкретного пользователя
router.get('/', auth, async (req, res) => {
    try {
        const links = await Link.find({ owner: req.user.userId }).lean(); // ищем все ссылки которые относятся к текущему пользователю
        res.json(links);
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});

// получение ссылки по id
router.get('/:id', auth, async (req, res) => {
    try {
        const link = await Link.findById(req.params.id).lean();
        res.json(link);
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});

router.delete('/delete/:id', auth, async (req, res) => {
    try {
        await Link.findByIdAndDelete(req.params.id).lean();
        res.json({ message: 'Ссылка была успешо удалена' });
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});

// lean функция позволяет убрать лишние из документа mongoose ускоряет приложение

router.patch('/edit/:id', auth, async (req, res) => {
    console.time('as');
    try {
        const link = await Link.findOneAndUpdate({ _id: req.params.id },
            { ...req.body.link, clicks: 0 }, { new: true }).lean();
        res.json({ message: 'Ссылка была успешо изменена', link, edited: true });
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова', edited: false });
    }
    console.timeEnd('as');
});

router.delete('/deleteall', auth, async (req, res) => {
    try {
        await Link.deleteMany({ owner: req.user.userId }).lean();
        res.json({ message: "Все ссылки были удалены", deleted: true });
    } catch (e) {
        res.status(404).json({ message: "Что-то пошло не так", deleted: false });
    }
});

module.exports = router;