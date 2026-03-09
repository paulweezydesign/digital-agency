import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  name: string;
  client: mongoose.Types.ObjectId;
  status: "planning" | "in-progress" | "review" | "completed" | "on-hold";
  description: string;
  tasks: mongoose.Types.ObjectId[];
  agents: string[];
  timeline: {
    startDate: Date;
    endDate: Date;
    milestones: { name: string; date: Date; completed: boolean }[];
  };
  budget: {
    total: number;
    spent: number;
    currency: string;
  };
  sprints: {
    name: string;
    startDate: Date;
    endDate: Date;
    tasks: mongoose.Types.ObjectId[];
    status: "planned" | "active" | "completed";
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    client: { type: Schema.Types.ObjectId, ref: "Client" },
    status: {
      type: String,
      enum: ["planning", "in-progress", "review", "completed", "on-hold"],
      default: "planning",
    },
    description: { type: String, default: "" },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    agents: [{ type: String }],
    timeline: {
      startDate: { type: Date },
      endDate: { type: Date },
      milestones: [
        {
          name: { type: String },
          date: { type: Date },
          completed: { type: Boolean, default: false },
        },
      ],
    },
    budget: {
      total: { type: Number, default: 0 },
      spent: { type: Number, default: 0 },
      currency: { type: String, default: "USD" },
    },
    sprints: [
      {
        name: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
        status: {
          type: String,
          enum: ["planned", "active", "completed"],
          default: "planned",
        },
      },
    ],
  },
  { timestamps: true }
);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
