import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true, 
    },
    lastName: {
      type: String,
      required: true,
      trim: true, 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Invalid email format"], 
    },
    password: {
      type: String,
      required: true,
      minlength: 6, 
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model("User", UserSchema);
