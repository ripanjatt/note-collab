import { model, Schema } from 'mongoose';

const noteSchema = new Schema(
  {
    noteId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    allowedUsers: {
      type: Array<string>,
    },
  },
  {
    timestamps: true,
  },
);

export default model('Note', noteSchema);
