import express from 'express';
import Secret from '../models/Secret';

const router = express.Router();

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

    res.status(200).json({
      hash: secret.hash,
      secretText: secret.secretText,
      createdAt: secret.createdAt,
      expiresAt: secret.expiresAt
    });
  } catch (err) {
    res.status(404).json('Secret not found');
  }
});

router.post('/', async (req, res) => {
  try { 
    const now = Date.now();

    const secret = new Secret({
      hash: Secret.getHash(req.body.secretText + now),
      secretText: req.body.secretText,
      createdAt: now,
      expiresAt: new Date( now + parseInt(req.body.expiresAt) * 1000 )
    });
  
    const data = await secret.save();
    
    res.status(200).json({
      hash: data.hash,
      secretText: data.secretText,
      createdAt: data.createdAt,
      expiresAt: data.expiresAt
    });
  } catch (err) {
    res.status(405).json('Invalid input');
  }

});

export default router;