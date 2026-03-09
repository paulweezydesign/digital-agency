import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  assignedAgent: string;
  status: "backlog" | "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  project: mongoose.Types.ObjectId;
  dependencies: mongoose.Types.ObjectId[];
  estimatedHours: number;
  actualHours: number;
  output: string;
  tags: string[];
  dueDate: Date;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    assignedAgent: { type: String, default: "" },
    status: {
      type: String,
      enum: ["backlog", "todo", "in-progress", "review", "done"],
      default: "backlog",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    dependencies: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    estimatedHours: { type: Number, default: 0 },
    actualHours: { type: Number, default: 0 },
    output: { type: String, default: "" },
    tags: [{ type: String }],
    dueDate: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
