const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {

    beforeEach((done) => {
        sequelize.sync({force: true})
        .then(() => {
            done();
        })
        .catch((err) => {
            console.log(err);
            done();
        });
    });

    describe("GET /users/signup", () => {
        it("should render a view with a sign up form", (done) => {
            request.get(`${base}signup`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Sign Up");
                done();
            });
        });
    }); //End GET Signup

    describe('POST /users/signup', () => {
        it('should create a new user with valid values and redirect', (done) => {
            const options = {
                url: `${base}signup`,
                form: {
                    username: 'user',
                    email: 'user@example.com',
                    password: '123456789'
                }
            }
            request.post(options,
                (err, res, body) => {
                    User.findOne({where: {username: 'user'}})
                    .then((user) => {
                        // console.log('this is the user', user);
                        expect(user).not.toBeNull();
                        expect(user.username).toBe('user');
                        expect(user.email).toBe('user@example.com');
                        expect(user.id).toBe(1);
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                }
            );
        });

        it('should not create a new user with invalid attributes and redirect', (done) => {
            request.post(
                {
                    url: `${base}signup`,
                    form: {
                        username: 'user',
                        email: 'no',
                        password: '123456789'
                    }
                },
                (err, res, body) => {
                    User.findOne({where: {email: 'no'}})
                    .then((user) => {
                        expect(user).toBeNull();
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                }
            );
        });

        it('should not create a new user with that fails validations', (done) => {
            request.post(
                {
                    url: `${base}signup`,
                    form: {
                        username: 'a',
                        email: 'user@example.com',
                        password: '123456789'
                    }
                },
                (err, res, body) => {
                    User.findOne({where: {username: 'a'}})
                    .then((user) => {
                        expect(user).toBeNull();
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                }
            );
        });
    }); //End POST signup

    describe('GET /users/signin', () => {
        it('should render a view with a sign in form', (done) => {
            request.get(`${base}signin`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain('Sign in');
                done();
            });
        });
    }); //END GET signin

});