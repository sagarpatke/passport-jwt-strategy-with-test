const chai = require('chai');
chai.should();
const app = require('../app');
const request = require('supertest');

describe('GET /notes', () => {
    it('should return one note', function(done) {
        request(app)
            .post('/authenticate')
            .send({username: 'admin', password: 'my-secret-pass'})
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if(err) { done(err); return; }

                res.body.should.have.property('token').and.exist;

                request(app)
                    .get('/api/notes')
                    .set('Authorization', `Bearer ${res.body.token}`)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        if(err) { done(err); return; }

                        res.body.should.be.an.instanceOf(Array).and.have.length(1).and.deep.include({id: 0, text: 'Remember the milk'})
                        done();
                    })
            });
    });
});