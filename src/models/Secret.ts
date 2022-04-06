import mongoose from 'mongoose';

const SecretSchema = new mongoose.Schema({
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