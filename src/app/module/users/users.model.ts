import { Schema, model } from 'mongoose';
import { TUser } from './users.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser>(
  {
    id: { type: String, required: true },
    password: { type: String, required: true },
    needsPasswordChange: { type: Boolean, default: true }, // When a user will be created, a temporary password will be given
    //-----------------------------------------------------// they need to change the password later
    role: {
      type: String,
      enum: ['student', 'admin', 'faculty'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, // timestamps will record when the user is created and when it is updated
  },
);

userSchema.pre('save', async function (next) {
  const doc = this;
  doc.password = await bcrypt.hash(
    doc.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export const UserModel = model<TUser>('Users', userSchema);
