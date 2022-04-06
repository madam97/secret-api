import express from 'express';
import Secret from '../models/Secret';

const router = express.Router();

router.get('/:hash', (req, res) => {
  res.send('TODO');
});

router.post('/', async (req, res) => {
  res.send('TODO');
});

export default router;