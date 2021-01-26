const router = require('express').Router();
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { confirmationMail } = require('../src/confirmationMail');
const jwt = require('jsonwebtoken');
const express = require('express-session');
const dotenv = require('dotenv');

const cookieSession = require('cookie-session')

router.use(cookieSession({
  name: 'twitter-auth-session',
  keys: ['key1', 'key2']
}))

// Initializes passport and passport sessions
router.use(express({ secret: process.env.TWITTER_TOKEN, cookie: { secure: true }, resave: true, saveUninitialized: true}))
router.use(passport.initialize());
router.use(passport.session());

// Auth Routes
router.get('/twitter', passport.authenticate('twitter'));

router.get('/Toauth2callback', passport.authenticate('twitter', { failureRedirect: '/failed' }),
  async (req, res) => {
    const Tuser = req.user.id;
    const Tmail = req.user.emails[0].value;
    const Tname = req.user.displayName.replace(/\s/g, '');
    const user = await User.findOne({ twitterId: Tuser });

    if (user) {
      console.log("Twitter-oAuth: User found")

      if (user.active == false) 
        return res.status(403).redirect('http://localhost:8080/validate_account');

        token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
        return res.status(200).cookie('jwt', token).redirect("http://localhost:8080/home")
    }

    else if (!user) {
      console.log("Twitter-oAuth: User not found")

      const emailExist = await User.findOne({ email: Tmail });
      if (emailExist) return res.status(402).send('Email already exist !');

      const salt = await bcrypt.genSalt(10);

      const hashActive = await bcrypt.hash(Tname, salt);

      const user = new User({
          username: Tname,
          email: Tmail,
          active: false,
          activeHash: hashActive.replace(/[^0-9a-z]/gi, ''),
          twitterId: Tuser
      });
      confirmationMail(Tmail, hashActive.replace(/[^0-9a-z]/gi, ''));
      try {
        await user.save();
        res.status(200).redirect("http://localhost:8080/mail_sent")
      } catch(err) {
        res.status(400).send(err);
      }
    }
  }
  
);

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
    callbackURL: "http://www.localhost:5000/oauth/Toauth2callback"
  },
  function(token, tokenSecret, profile, done) {
    /*
     use the profile info (mainly profile id) to check if the user is registerd in ur db
     If yes select the user and pass him to the done callback
     If not create the user and then select him and pass to callback
    */
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  /*
  From the user take just the id (to minimize the cookie size) and just pass the id of the user
  to the done callback
  PS: You dont have to do it like this its just usually done like this
  */
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  /*
  Instead of user this function usually recives the id 
  then you use the id to select the user from the db and pass the user obj to the done callback
  PS: You can later access this data in any routes in: req.user
  */
  done(null, user);
});

module.exports = router;
