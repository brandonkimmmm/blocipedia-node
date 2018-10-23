module.exports = {
    fakeIt(app){
        let username, id, email, private

        function middleware(req, res, next){
            username = req.body.username || username;
            email = req.body.email || email;
            id = req.body.userId || id;
            private = req.body.private || private;

            if(id && id != 0){
                req.user = {
                    'id': id,
                    'username': username,
                    'email': email,
                    'private': private
                };
            } else if(id == 0) {
                delete req.user;
            }

            if( next ){ next() }
        }

        function route(req, res){
            res.redirect('/');
        }

        app.use(middleware);
        app.get('/auth/fake', route);
    }
}