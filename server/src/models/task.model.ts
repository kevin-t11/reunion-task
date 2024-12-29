import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    status: {
      type: String,
      enum: ["pending", "finished"],
      required: true,
      default: "pending",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

TaskSchema.methods.calculateTotalTime = function () {
  const currentTime = new Date();
  if (this.status === "pending") {
    const lapsedTime = Math.max(0, currentTime.getTime() - this.startTime.getTime());
    const balanceTime = Math.max(0, this.endTime.getTime() - currentTime.getTime());
    return {
      totalTimeLapsed: lapsedTime / (1000 * 60 * 60), //convert in hours
      balanceTimeLeft: balanceTime / (1000 * 60 * 60), 
    };
  }
  return (this.endTime - this.startTime) / (1000 * 60 * 60);
};

export default mongoose.model("Task", TaskSchema);
