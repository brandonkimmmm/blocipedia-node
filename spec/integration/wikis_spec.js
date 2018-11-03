const request = require('request');
const server = require('../../src/server');
const base = 'http://localhost:3000/wikis/';
const sequelize = require('../../src/db/models/index').sequelize;
const Wiki = require('../../src/db/models').Wiki;
const User = require('../../src/db/models').User;

describe('routes : wikis', () => {

    beforeEach((done) => {
        this.user;
        this.wiki;
        sequelize.sync({force: true}).then((res) => {
            User.create({
                username: 'example',
                email: 'user@example.com',
                password: 'password',
                role: 0
            })
            .then((user) => {
                this.user = user;
                Wiki.create({
                    title: 'Wookies',
                    body: 'The different cultures of Wookies',
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

    //START STANDARD USER CONTEXT
    describe('standard user performing CRUD actions for Wiki', () => {
        beforeEach((done) => {
            request.get({
                url: 'http://localhost:3000/auth/fake',
                form: {
                    role: this.user.role,
                    id: this.user.id,
                    email: this.user.email,
                    username: this.user.username
                }
            },
                (err, res, body) => {
                    done();
                }
            )
        });

        describe('GET /wikis', () => {
            it('should return a status code 200 and all wikis', (done) => {
                request.get(base, (err, res, body) => {
                    expect(res.statusCode).toBe(200);
                    expect(err).toBeNull();
                    expect(body).toContain('Wikis');
                    expect(body).toContain('Wookies');
                    done();
                });
            });
        }); // GET wikis end

        describe('POST /wikis/create', () => {
            it('should create a new wiki and redirect', (done) => {
                const options = {
                    url: `${base}create`,
                    form: {
                        title: 'Lakers',
                        body: 'Lakers are the best team ever',
                        userId: this.user.id
                    }
                };
                request.post(options,
                    (err, res, body) => {
                        Wiki.findOne({where: {title: 'Lakers'}})
                        .then((wiki) => {
                            expect(res.statusCode).toBe(303);
                            expect(wiki.title).toBe('Lakers');
                            expect(wiki.body).toBe('Lakers are the best team ever');
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                    }
                );
            });
        }); //END POST wikis/create

        describe('GET /wikis/new', () => {
            it('should render a new wiki form', (done) => {
                request.get(`${base}new`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain('New Wiki');
                    done();
                });
            });
        }); //END GET wikis/new

        describe('GET /wikis/:id', () => {
            it('should render a view with the selected wiki', (done) => {
                request.get(`${base}${this.wiki.id}`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain('Wookies');
                    done();
                });
            });
        }); //END GET wikis/:id

        describe('POST /wikis/:id/destroy', () => {
            it('should delete the wiki with the associated ID', (done) => {
                Wiki.all()
                .then((wikis) => {
                    const wikiCountBeforeDelete = wikis.length;
                    expect(wikiCountBeforeDelete).toBe(1);
                    request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
                        Wiki.all()
                        .then((wikis) => {
                            expect(err).toBeNull();
                            expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
                            done();
                        });
                    });
                });
            });

            it('should not delete the wiki with the associated ID if user is not owner', (done) => {
                User.create({
                    email: 'someone@example.com',
                    password: 'password',
                    role: 0,
                    username: 'someone'
                })
                .then((user) => {
                    Wiki.create({
                        title: 'Not My Wiki',
                        body: 'really not mine',
                        userId: user.id
                    })
                    .then((wiki) => {
                        Wiki.all()
                        .then((wikis) => {
                            const wikiCountBeforeDelete = wikis.length;
                            expect(wikiCountBeforeDelete).toBe(2);
                            request.post(`${base}${wiki.id}/destroy`, (err, res, body) => {
                                Wiki.all()
                                .then((wikis) => {
                                    expect(res.statusCode).toBe(302);
                                    expect(wikis.length).toBe(wikiCountBeforeDelete);
                                    done();
                                });
                            });
                        });
                    })
                });
            });
        }); //END POST /wikis/:id/destroy

        describe('GET /wikis/:id/edit', () => {
            it('should render a view with an edit wiki form', (done) => {
                request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain('Edit Wiki');
                    expect(body).toContain('Wookies');
                    done();
                });
            });
        }); //END GET /wikis/:id/edit

        describe('POST /wikis/:id/update', () => {
            it('should update the wiki with the give values', (done) => {
                const options = {
                    url: `${base}${this.wiki.id}/update`,
                    form: {
                        title: 'Darth Vader',
                        body: 'His clothes were black'
                    }
                };

                request.post(options,
                    (err, res, body) => {
                        expect(err).toBeNull();
                        Wiki.findOne({
                            where: { id: this.wiki.id }
                        })
                        .then((wiki) => {
                            expect(wiki.title).toBe('Darth Vader');
                            expect(wiki.body).toBe('His clothes were black');
                            done();
                        });
                    }
                );
            });
        }) //END POST /wikis/:id/update
    }); //END STANDARD USER CONTEXT

    // //START PREMIUM USER CONTEXT
    // describe('premium user performing CRUD actions for Wiki', () => {
    //     beforeEach((done) => {
    //         User.create({
    //             email: 'premium@example.com',
    //             password: 'password',
    //             role: 1,
    //             username: 'premium'
    //         })
    //         .then((user) => {
    //             this.user = user;
    //             request.get({
    //                 url: 'http://localhost:3000/auth/fake',
    //                 form: {
    //                     role: user.role,
    //                     id: user.id,
    //                     email: user.email,
    //                     username: user.username
    //                 }
    //             })
    //         });
    //     });

    //     describe('POST /wiki/create', () => {
    //         it('should create a private wiki', (done) => {
    //             const options = {
    //                 url: `${base}create`,
    //                 form: {
    //                     title: 'private wiki',
    //                     body: 'my private wiki',
    //                     userId: this.user.id,
    //                     private: true
    //                 }
    //             };
    //             request.post(options,
    //                 (err, res, body) => {
    //                     Wiki.findOne({where: {title: 'private wiki'}})
    //                     .then((wiki) => {
    //                         expect(res.statusCode).toBe(303);
    //                         expect(wiki.title).toBe('private');
    //                         expect(wiki.body).toBe('Lakers are the best team ever');
    //                         done();
    //                     })
    //                     .catch((err) => {
    //                         console.log(err);
    //                         done();
    //                     });
    //                 }
    //             );
    //         });
    //     });

    //     describe('GET /wikis', () => {
    //         it('should show users private wikis as well as public ones', (done) => {
    //             Wiki.create({
    //                 title: 'private wiki',
    //                 body: 'my private wiki',
    //                 private: true,
    //                 userId: this.user
    //             })
    //             .then((wiki) => {
    //                 request.get(base, (err, res, body) => {
    //                     expect(res.statusCode).toBe(200);
    //                     expect(err).toBeNull();
    //                     expect(body).toContain('Wikis');
    //                     expect(body).toContain('Wookies');
    //                     expect(body).toContain('Private Wikis');
    //                     expect(body).toContain('private wiki');
    //                     done();
    //                 });
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //                 done();
    //             })
    //         });

    //         it('should not show private wikis from other users', (done) => {
    //             User.create({
    //                 email: 'other@other.com',
    //                 password: 'password',
    //                 role: 1,
    //                 username: 'other'
    //             })
    //             .then((user) => {
    //                 Wiki.create({
    //                     title: 'other private',
    //                     body: 'private wiki',
    //                     userId: user.id
    //                 })
    //                 .then((wiki) => {
    //                     request.get(base, (err, res, body) => {
    //                         expect(res.statusCode).toBe(200);
    //                         expect(err).toBeNull();
    //                         expect(body).toContain('Wikis');
    //                         expect(body).toContain('Private Wikis');
    //                         expect(body).not.toContain('other private');
    //                         expect(body).toContain('Wookies');
    //                         done();
    //                     });
    //                 })
    //                 .catch((err) => {
    //                     console.log(err);
    //                     done();
    //                 });
    //             });
    //         });
    //     }); // END GET /wiki
    // }); //END PREMIUM USER CONTEXT

    //START ADMIN USER CONTEXT
    describe('standard user performing CRUD actions for Wiki', () => {
        beforeEach((done) => {
            User.create({
                email: 'admin@example.com',
                password: 'password',
                role: 2,
                username: 'admin'
            })
            .then((user) => {
                request.get({
                    url: 'http://localhost:3000/auth/fake',
                    form: {
                        role: user.role,
                        id: user.id,
                        email: user.email,
                        username: user.username
                    }
                },
                    (err, res, body) => {
                        done();
                    }
                )
            });
        });

        describe('POST /wikis/:id/destroy', () => {
            it('should delete the wiki with the associated ID even if not owner', (done) => {
                Wiki.all()
                .then((wikis) => {
                    const wikiCountBeforeDelete = wikis.length;
                    expect(wikiCountBeforeDelete).toBe(1);
                    request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
                        Wiki.all()
                        .then((wikis) => {
                            expect(err).toBeNull();
                            expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
                            done();
                        });
                    });
                });
            });
        }); //END POST /wikis/:id/destroy
    }); //END ADMIN USER CONTEXT
});