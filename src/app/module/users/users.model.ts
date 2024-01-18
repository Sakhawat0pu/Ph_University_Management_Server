import { Schema, model } from 'mongoose';
import { TUser, TUserModel } from './users.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser, TUserModel>(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 }, // set select to 0 to omit it from being sent to the response. Also, this will exclude password field from all types of find operation. To add this field into find operations use .select('+password)
    needsPasswordChange: { type: Boolean, default: true }, // When a user will be created, a temporary password will be given
    //-----------------------------------------------------// they need to change the password later
    passwordChangedAt: { type: Date },
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

userSchema.statics.isUserExists = async function (id: string) {
  return await UserModel.findOne({ id }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJwtIssuedBeforePasswordChange = function (
  passwordChangedAtTimestamp: Date,
  jwtIssuedAtTimestamp: number,
) {
  const passwordChangedAtTime =
    new Date(passwordChangedAtTimestamp).getTime() / 1000;
  return passwordChangedAtTime > jwtIssuedAtTimestamp;
};

userSchema.pre('save', async function (next) {
  const doc = this;
  doc.password = await bcrypt.hash(
    doc.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

// Either use this function to remove the password from 'get(find)' response, or set select to 0 in the password section of userSchema [shown above] - don't need to use both
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});
// difference between using set with 'toJSON' and select: 0
// set is applied after the find/findOne/findById query, whereas select: 0 is applied before find/findOne/findById query, this is why the result of find query don't provide the field for which select is set to 0;

export const UserModel = model<TUser, TUserModel>('Users', userSchema);
