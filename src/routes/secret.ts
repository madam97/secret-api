import express from 'express';
import Secret from '../models/Secret';

const router = express.Router();
let code: number = 500;
let response: string | object = 'unknown error';

router.get('/:hash', async (req, res) => {
  try {
    const hash = req.params.hash;

    const secret = await Secret.findOne({ hash }).exec();

    if (!secret) {
      throw new Error(`secret with ${hash} is not found`);
    }
    
    // Secret is expirated
    if (secret.createdAt.getTime() !== secret.expiresAt.getTime() &&
      secret.expiresAt.getTime() < Date.now()) {
      throw new Error('secret is expired');
    }

    code = 200;
    response = {
      hash: secret.hash,
      secretText: secret.secretText,
      createdAt: secret.createdAt,
      expiresAt: secret.expiresAt
    };
  } catch (err) {
    code = 404;
    response = 'Secret not found' + (err instanceof Error ? ': '+err.message : '');
  } finally {
    if (req.accepts('json')) {
      res.status(code).json(response);
    } else {
      res.status(500).json('only JSON accept header is allowed');
    }
  }
});

router.post('/', async (req, res) => {
  try { 
    const now = Date.now();

    const secret = new Secret({
      hash: Secret.getHash(req.body.secret + now),
      secretText: req.body.secret,
      createdAt: now,
      expiresAt: new Date( now + parseInt(req.body.expireAfter) * 1000 )
    });
  
    const data = await secret.save();
    
    code = 200;
    response = {
      hash: data.hash,
      secretText: data.secretText,
      createdAt: data.createdAt,
      expiresAt: data.expiresAt
    };
  } catch (err) {
    code = 405;
    response = 'Invalid input' + (err instanceof Error ? ': '+err.message : '');
  } finally {
    if (req.accepts('json')) {
      res.status(code).json(response);
    } else {
      res.status(500).json('only JSON accept header is allowed');
    }
  }

});

export default router;