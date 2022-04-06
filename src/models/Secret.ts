import { Model, Schema, model } from 'mongoose';
import crypto from 'crypto';

interface ISecret {
  hash: string,
  secretText: string,
  createdAt: Date,
  expiresAt: Date
}

interface ISecretModel extends Model<ISecret> {
  getHash: (text: string) => string
}

const SecretSchema = new Schema<ISecret>({
  hash: {
    type: String,
    required: true,
    unique : true
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

SecretSchema.statics.getHash = (text: string): string => {
  return crypto.createHash('sha256').update(text).digest('hex');
}

const SecretModel = model<ISecret, ISecretModel>('Secrets', SecretSchema);

export default SecretModel;