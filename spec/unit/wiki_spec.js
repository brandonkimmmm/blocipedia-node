const sequelize = require('../../src/db/models/index').sequelize;
const Wiki = require('../../src/db/models').Wiki;
const User = require('../../src/db/models').User;

describe('Wiki', () => {
    beforeEach((done) => {
        this.user;
        this.wiki;
        sequelize.sync({force: true}).then((res) => {
            User.create({
                username: 'example',
                email: 'user@example.com',
                password: 'password'
            })
            .then((user) => {
                this.user = user;
                Wiki.create({
                    title: 'Lakers',
                    body: 'Kobe and Shaq',
                    userId: this.user.id
                })
                .then((wiki) => {
                    this.wiki = wiki;
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    });

    describe('#create()', () => {
        it('should create a wiki object with a title, body, assigned user, and private', (done) => {
            Wiki.create({
                title: 'The NBA',
                body: 'Is the best league',
                userId: this.user.id
            })
            .then((wiki) => {
                expect(wiki.title).toBe('The NBA');
                expect(wiki.body).toBe('Is the best league');
                expect(wiki.userId).toBe(this.user.id);
                expect(wiki.private).toBe(false);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it('should not create a wiki object without a title, body, or assigned user', (done) => {
            Wiki.create({
                title: 'The NBA'
            })
            .then((wiki) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain('Wiki.body cannot be null');
                expect(err.message).toContain('Wiki.userId cannot be null');
                done();
            });
        });
    }); //End create

    describe('#setUser()', () => {
        it('should associate a user and a wiki together', (done) => {
            User.create({
                username: 'kobe',
                email: 'kobe@lakers.com',
                password: 'password'
            })
            .then((newUser) => {
                expect(this.wiki.userId).toBe(this.user.id);
                this.wiki.setUser(newUser)
                .then((wiki) => {
                    expect(wiki.userId).toBe(newUser.id);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                })
            });
        });
    }); //End setUser

    describe('#getUser()', () => {
        it('should return the associated user', (done) => {
            this.wiki.getUser()
            .then((associatedUser) => {
                expect(associatedUser.username).toBe('example');
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            })
        });
    }); //End getUser
});