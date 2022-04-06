import mongoose from 'mongoose';
import crypto from 'crypto';

interface ISecret {
  hash: string,
  secretText: string,
  createdAt: Date,
  expiresAt: Date
}

const SecretSchema = new mongoose.Schema<ISecret>({
  hash: {
    type: String,
    required: true,
    unique : true,
    set: (v: string) => crypto.createHash('sha256').update(v).digest('hex')
  },
  secretText: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

const SecretModel = mongoose.model('Secrets', SecretSchema);

export default SecretModel;