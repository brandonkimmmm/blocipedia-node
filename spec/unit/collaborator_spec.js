const sequelize = require('../../src/db/models/index').sequelize;
const User = require('../../src/db/models').User;
const Wiki = require('../../src/db/models').Wiki;
const Collaborator = require('../../src/db/models').Collaborator;

describe('Collaborator', () => {
    beforeEach((done) => {
        this.user;
        this.wiki;
        this.collaborator;

        sequelize.sync({force: true}).then((res) => {
            User.create({
                username: 'user',
                email: 'user@example.com',
                password: 'password',
                role: 1
            })
            .then((res) => {
                this.user = res;

                Wiki.create({
                    title: 'private wiki',
                    body: 'this is a private wiki',
                    userId: this.user.id,
                    private: true
                })
                .then((res) => {
                    this.wiki = res;
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                })
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    describe('#create()', () => {
        beforeEach((done) => {
            User.create({
                username: 'standard',
                email: 'standard@example.com',
                password: 'password',
                role: 0
            })
            .then((res) => {
                this.user = res;
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it('should set a user as a collaborator on a wiki', (done) => {
            Collaborator.create({
                userId: this.user.id,
                wikiId: this.wiki.id
            })
            .then((collab) => {
                expect(collab.userId).toBe(this.user.id);
                expect(collab.wikiId).toBe(this.wiki.id);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it('should not set a user as a collaborator on a wiki without wiki id', (done) => {
            Collaborator.create({
                userId: this.user.id
            })
            .then((collab) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain('Collaborator.wikiId cannot be null');
                done();
            });
        });
    }); //END CREATE

    describe('#setUser()', () => {
        it('should associate a collaborator and a user together', (done) => {
            Collaborator.create({
                userId: this.user.id,
                wikiId: this.wiki.id
            })
            .then((collab) => {
                this.collaborator = collab;
                expect(collab.userId).toBe(this.user.id);
                User.create({
                    username: 'username',
                    email: 'email@email.com',
                    password: 'password'
                })
                .then((newUser) => {
                    this.collaborator.setUser(newUser)
                    .then((collab) => {
                        expect(collab.userId).toBe(newUser.id);
                        done();
                    });
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    }); //END SET USER

    describe('#getUser()', () => {
        it('should return the associated user', (done) => {
            Collaborator.create({
                userId: this.user.id,
                wikiId: this.wiki.id
            })
            .then((collab) => {
                collab.getUser()
                .then((user) => {
                    expect(user.id).toBe(this.user.id);
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    }); //END GET USER

    describe('#setWiki()', () => {
        it('should associate a wiki and a collaborator together', (done) => {
            Collaborator.create({
                userId: this.user.id,
                wikiId: this.wiki.id
            })
            .then((collab) => {
                this.collaborator = collab;
                Wiki.create({
                    title: 'new private',
                    body: 'a new private wiki',
                    userId: this.user.id,
                    private: true
                })
                .then((newWiki) => {
                    expect(this.collaborator.wikiId).toBe(this.wiki.id);
                    this.collaborator.setWiki(newWiki)
                    .then((collab) => {
                        expect(collab.wikiId).toBe(newWiki.id);
                        done();
                    });
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    }); //END SET WIKI

    describe('#getWiki()', () => {
        it('should return the associated wiki', (done) => {
            Collaborator.create({
                userId: this.user.id,
                wikiId: this.wiki.id
            })
            .then((collab) => {
                collab.getWiki()
                .then((associatedWiki) => {
                    expect(associatedWiki.title).toBe('private wiki');
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    }); //END GET WIKI
});