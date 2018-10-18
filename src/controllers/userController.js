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
            passwordConfirmation: req.body.passwordConfirmation
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
    }
}