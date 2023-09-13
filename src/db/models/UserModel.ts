import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    notes: {
      type: Array<string>,
    },
  },
  {
    timestamps: true,
  },
);

export default model('User', userSchema);
