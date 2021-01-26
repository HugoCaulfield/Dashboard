const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../routes/verifyToken');
const { registerValidation, loginValidation } = require('../validation');
const { confirmationMail } = require('../src/confirmationMail');

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(401).send(error.details[0].message);

    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(402).send('Email already exist !');

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const hashActive = await bcrypt.hash(req.body.username, salt);

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
        active: false,
        activeHash: hashActive.replace(/[^0-9a-z]/gi, ''),
        subscribe: []
    });
    confirmationMail(req.body.email, hashActive.replace(/[^0-9a-z]/gi, ''));
    try {
        await user.save();
        res.status(200).send("Success !");
    } catch(err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).send('Invalid email !');

    if (user.active == false) 
        return res.status(403).send('Validate your account !');

    if (!user.password) 
        return res.status(403).send('You can only log in using oAuth !');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(402).send('Invalid password !');

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    return res.status(200).json({ token });
});

router.get('/getUsername', auth, async (req, res) => {
    id = jwt.verify(req.header('jwt'), process.env.TOKEN_SECRET)
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(401).send('User not found');
    return res.status(200).send({ username: user.username });
});

router.get('/:hash1', async (req, res) => {
    const hash = req.params.hash1;
    const user = await User.findOne({ activeHash: hash });

    const query = { activeHash: hash };
    user.active = true;
    User.findOneAndUpdate(query, user, {upsert: true}, function(err, doc) {
        if (err) return res.send(500, {error: err});
        return res.redirect("http://localhost:8080/login");
    });
});

module.exports = router;
