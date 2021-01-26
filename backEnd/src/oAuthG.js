const router = require('express').Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { confirmationMail } = require('../src/confirmationMail');
const jwt = require('jsonwebtoken');

var token = ""

// Initializes passport and passport sessions
router.use(passport.initialize());
router.use(passport.session());

// Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/gmail.compose', 'https://www.googleapis.com/auth/gmail.send'] }));

router.get('/Goauth2callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  async (req, res) => {
    const Guser = req.user.id
    const Gmail = req.user.emails[0].value
    const Gname = req.user.displayName.replace(/\s/g, '')
    const user = await User.findOne({ googleId: Guser })

    if (user) {
      console.log("Google-oAuth: User found")

      if (user.active == false)
        return res.status(403).redirect('http://localhost:8080/validate_account');

      user.googleToken = token
      await user.save()

      token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
      return res.status(200).cookie('jwt', token).redirect("http://localhost:8080/home")
    }

    else if (!user) {
      console.log("Google-oAuth: User not found")

      const emailExist = await User.findOne({ email: Gmail })
      if (emailExist) return res.status(402).send('Email already exist !')

      const salt = await bcrypt.genSalt(10)

      const hashActive = await bcrypt.hash(Gname, salt)

      const user = new User({
        username: Gname,
        email: Gmail,
        active: false,
        activeHash: hashActive.replace(/[^0-9a-z]/gi, ''),
        googleId: Guser,
        googleToken: token
      });
      confirmationMail(Gmail, hashActive.replace(/[^0-9a-z]/gi, ''))
      try {
        await user.save();
        res.status(200).redirect("http://localhost:8080/mail_sent")
      } catch (err) {
        res.status(400).send(err)
      }
    }
  }
);

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/oauth/Goauth2callback"
},
  function (accessToken, refreshToken, profile, done) {
    /*
      use the profile info (mainly profile id) to check if the user is registerd in ur db
      If yes select the user and pass him to the done callback
      If not create the user and then select him and pass to callback
    */
    token = accessToken
    return done(null, profile);
  }
));

passport.serializeUser(function (user, done) {
  /*
  From the user take just the id (to minimize the cookie size) and just pass the id of the user
  to the done callback
  PS: You dont have to do it like this its just usually done like this
  */
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  /*
  Instead of user this function usually recives the id 
  then you use the id to select the user from the db and pass the user obj to the done callback
  PS: You can later access this data in any routes in: req.user
  */
  done(null, user);
});

module.exports = router;
