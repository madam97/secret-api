import express from 'express';
import Secret from '../models/Secret';

const router = express.Router();

router.get('/:hash', (req, res) => {
  res.send('TODO');
});

router.post('/', async (req, res) => {
  try { 
    const now = Date.now();

    const secret = new Secret({
      hash: req.body.secretText + now,
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
    res.status(405).json({
      msg: 'Invalid input'
    });
  }

});

export default router;