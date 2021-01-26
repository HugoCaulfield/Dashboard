const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../routes/verifyToken');

router.get('/subscribe_list', auth, async (req, res) => {
    id = jwt.verify(req.header('jwt'), process.env.TOKEN_SECRET)
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(401).send('User not found');
    return res.status(200).send({
        list_service: user.subscribe,
        Widgets: user.Widgets
    });
});

router.post('/subscribe_service', auth, async (req, res) => {
    id = jwt.verify(req.header('jwt'), process.env.TOKEN_SECRET)
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(401).send('User not found');

    if (!user.subscribe.includes(req.body.name_service)) {
        user.subscribe.push(req.body.name_service)

        try {
            await user.save();
            res.status(200).send("Success !");
        } catch(err) {
            res.status(400).send(err);
        }
    } else res.status(402).send("Already subscribed to the service");
});

router.delete('/delete_service', auth, async (req, res) => {
    id = jwt.verify(req.header('jwt'), process.env.TOKEN_SECRET)
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(401).send('User not found');

    if (user.subscribe.includes(req.body.name_service)) {
        index = user.subscribe.indexOf(req.body.name_service);
        user.subscribe.splice(index, 1);

        try {
            await user.save();
            res.status(200).send("Success !");
        } catch(err) {
            res.status(400).send(err);
        }
    } else res.status(403).send("You are not subscribed to this service");
});

router.post('/addWidget', auth, async (req, res) => {
    id = jwt.verify(req.header('jwt'), process.env.TOKEN_SECRET)
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(401).send('User not found');

    user.Widgets.push(req.body.Widgets[0])
    try {
        await user.save();
        res.status(200).send("Success !");
    } catch(err) { res.status(400).send(err) }
});

router.delete('/delWidget', auth, async (req, res) => {
    let index = 0;

    id = jwt.verify(req.header('jwt'), process.env.TOKEN_SECRET)
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(401).send('User not found');

    for (let i = 0; i < user.Widgets.length; i++) {
        if (req.body.Widgets[0]._id == user.Widgets[i]._id) {
            index = i;
        }
    };
    user.Widgets.splice(index, 1);
    try {
        await user.save();
        res.status(200).send("Success !");
    } catch(err) { res.status(400).send(err) }
});

module.exports = router;
