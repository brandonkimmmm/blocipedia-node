const request = require('request');
const server = require('../../src/server');
const base = 'http://localhost:3000/wikis/';
const sequelize = require('../../src/db/models/index').sequelize;
const Wiki = require('../../src/db/models').Wiki;
const User = require('../../src/db/models').User;

describe('routes : topics', () => {

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

    describe('GET /wikis/new', () => {
        it('should render a new wiki form', (done) => {
            request.get(`${base}new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain('New Wiki');
                done();
            });
        });
    }); //END GET wikis/new

    describe('POST /wikis/create', () => {
        beforeEach((done) => {
            request.get({
                url: 'http://localhost:3000/auth/fake'
            },
                (err, res, body) => {
                    done();
                }
            );
        });
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
});