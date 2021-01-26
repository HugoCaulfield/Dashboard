const router = require('express').Router();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { confirmationMail } = require('../src/confirmationMail');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Initializes passport and passport sessions
router.use(passport.initialize());
router.use(passport.session());

// Auth Routes
router.get('/facebook', passport.authenticate('facebook', { scope : ['email'] }));

router.get('/Foauth2callback', passport.authenticate('facebook', { failureRedirect: '/failed' }),
  async (req, res) => {
    const Fuser = req.user.id;
    const Fmail = req.user.emails[0].value;
    const Fname = req.user.displayName.replace(/\s/g, '');
    const user = await User.findOne({ facebookId: Fuser });

    if (user) {
      console.log("Facebook-oAuth: User found")

      if (user.active == false) 
        return res.status(403).redirect('http://localhost:8080/validate_account');

        token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
        return res.status(200).cookie('jwt', token).redirect("http://localhost:8080/home")
    }

    else if (!user) {
      console.log("Facebook-oAuth: User not found")

      const emailExist = await User.findOne({ email: Fmail });
      if (emailExist) return res.status(402).send('Email already exist !');

      const salt = await bcrypt.genSalt(10);

      const hashActive = await bcrypt.hash(Fname, salt);

      const user = new User({
          username: Fname,
          email: Fmail,
          active: false,
          activeHash: hashActive.replace(/[^0-9a-z]/gi, ''),
          facebookId: Fuser
      });
      confirmationMail(Fmail, hashActive.replace(/[^0-9a-z]/gi, ''));
      try {
        await user.save();
        res.status(200).redirect("http://localhost:8080/mail_sent")
      } catch(err) {
        res.status(400).send(err);
      }
    }
  }
);

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/oauth/Foauth2callback",
    profileFields: ['id', 'emails', 'name', 'displayName']
  },
  function(accessToken, refreshToken, profile, done) {
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
