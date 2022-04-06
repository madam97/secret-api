import request from 'supertest';
import { describe, test, expect } from '@jest/globals';
import app from '../../app';
import Secret from '../../models/Secret';

describe('Secret endpoints', () => {

  // Common
  describe('common', () => {
    test('if accept header is invalid, should respond with a 500 status code', async () => {
      const res = await request(app)
        .get('/secret/any-hash')
        .set('accept', 'invalid-mime')
        .send();

      expect(res.statusCode).toBe(500); 
    });
  });



  // POST /
  describe('POST /', () => {

    test('if secretText is missing, should respond with a 405 status code', async () => {
      const res = await request(app)
        .post('/secret')
        .send({
          expireAfter: 1
        });

      expect(res.statusCode).toBe(405); 
    });

    test('should return hash, secretText, createdAt and expiresAt', async () => {
      const res = await request(app)
        .post('/secret')
        .set('accept', 'application/json')
        .send({
          secretText: 'something',
          expireAfter: 1
        })
        .expect(200);

      expect(res.body.hash).toBeDefined(); 
      expect(res.body.secretText).toBeDefined(); 
      expect(res.body.createdAt).toBeDefined(); 
      expect(res.body.expiresAt).toBeDefined(); 
    });

    test('if expireAfter = 0, createdAt and expiresAt should be equal', async () => {
      const res = await request(app)
        .post('/secret')
        .set('accept', 'application/json')
        .send({
          secretText: 'something',
          expireAfter: 0
        })
        .expect(200);

      expect(res.body.createdAt).toBe(res.body.expiresAt); 
    });

    test('should generate hash from secretText and createdAt time', async () => {
      const res = await request(app)
        .post('/secret')
        .set('accept', 'application/json')
        .send({
          secretText: 'something',
          expireAfter: 1
        })
        .expect(200);

      const hash = Secret.getHash( res.body.secretText + new Date(res.body.createdAt).getTime() );

      expect(res.body.hash).toBe(hash); 
    });

  });



  // GET /:hash
  describe('GET /:hash', () => {
    
    test('if secret is not found, should respond with a 404 status code', async () => {
      const res = await request(app)
        .get('/secret/123456')
        .send();

      expect(res.statusCode).toBe(404); 
    });

    test('should return secret text after using hash to get the secret', async () => {
      const secretText = 'do-not-read';

      const resPost = await request(app)
        .post('/secret')
        .set('accept', 'application/json')
        .send({
          secretText,
          expireAfter: 60
        })
        .expect(200);

      const resGet = await request(app)
        .get(`/secret/${resPost.body.hash}`)
        .set('accept', 'application/json')
        .send()
        .expect(200);

      expect(resGet.body.secretText).toBe(secretText); 
    });

    test('if secret is expired, should respond with a 404 status code', async () => {
      const expireAfter = 1;

      const resPost = await request(app)
        .post('/secret')
        .set('accept', 'application/json')
        .send({
          secretText: 'something',
          expireAfter: expireAfter
        })
        .expect(200);
      
      setTimeout(async () => {

        const resGet = await request(app)
          .get(`/secret/${resPost.body.hash}`)
          .set('accept', 'application/json')
          .send();
  
        expect(resGet.statusCode).toBe(404); 

      }, expireAfter * 1000);

    });

  });

});