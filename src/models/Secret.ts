import mongoose from 'mongoose';

interface ISecret {
  hash: string,
  secretText: string,
  createdAt: Date,
  expiresAt: Date
}

const SecretSchema = new mongoose.Schema<ISecret>({
  hash: {
    type: String,
    required: true
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