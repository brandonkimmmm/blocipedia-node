const userQueries = require('../db/queries.users.js');
const passport = require('passport');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    signup(req, res, next){
        res.render('users/signup');
    },

    create(req, res, next){
        let newUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation,
            profileImage: req.body.profileImage || undefined,
            role: 0
        };
        userQueries.createUser(newUser, (err, user) => {
            if(err){
                req.flash('error', err);
                res.redirect('/users/signup');
            } else {
                const msg = {
                    to: user.email,
                    from: 'bkim2490@gmail.com',
                    subject: 'Thank you for signing up with Blocipedia!',
                    text: 'Thank you ' + user.username + '! You\'ve successfully signed up for Blocipedia!',
                    html: 'Thank you <strong>' + user.username + '</strong>! You\'ve successfully signed up for Blocipedia!'
                };
                sgMail.send(msg);
                passport.authenticate('local')(req, res, () => {
                    req.flash('notice', 'You\'ve successfully signed in!');
                    res.redirect('/');
                });
            }
        });
    },

    signInForm(req, res, next){
        res.render('users/signin');
    },

    signIn(req, res, next){
        passport.authenticate('local')(req, res, function() {
            if(!req.user){
                req.flash('notice', 'Invalid email or password, please try again.');
                res.redirect('/users/signin');
            } else {
                req.flash('notice', 'You\'ve successfully signed in!');
                res.redirect('/');
            }
        })
    },

    signOut(req, res, next){
        req.logout();
        req.flash('notice', 'You\'ve successfully signed out!');
        res.redirect('/');
    },

    profile(req, res, next){
        userQueries.getUser(req.params.id, (err, result) => {
            if(err || result === undefined){
                req.flash('notice', 'No user found with that ID.');
                res.redirect('/');
            } else {
                res.render('users/profile', {result});
            }
        })
    },

    upgrade(req, res, next){
        // Set your secret key: remember to change this to your live secret key in production
        // See your keys here: https://dashboard.stripe.com/account/apikeys
        let stripe = require("stripe")(process.env.STRIPE_KEY);

        // Token is created using Checkout or Elements!
        // Get the payment token ID submitted by the form:
        const token = req.body.stripeToken; // Using Express
        console.log('this is the token', token);

        const charge = stripe.charges.create({
            amount: 1500,
            currency: 'usd',
            description: 'Upgrade to Premium',
            source: token
        });

        userQueries.upgradeUser(req.params.id, (err, user) => {
            if(err || user === undefined){
                req.flash('notice', 'Something went wrong');
                res.redirect('/');
            } else {
                req.flash('notice', 'Account successfully updated!');
                res.redirect('/');
            }
        })
    },

    downgrade(req, res, next){
        userQueries.downgradeUser(req.params.id, (err, user) => {
            if(err || user === undefined){
                req.flash('notice', 'Something went wrong');
                res.redirect('/');
            } else {
                req.flash('notice', 'Account successfully downgraded');
                res.redirect('/');
            }
        })
    }
}