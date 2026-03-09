import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClient extends Document {
  company: string;
  contacts: {
    name: string;
    email: string;
    phone: string;
    role: string;
    primary: boolean;
  }[];
  pipelineStage: "lead" | "qualified" | "proposal" | "onboarding" | "active" | "churned";
  qualificationScore: number;
  notes: string;
  interactions: {
    type: "email" | "call" | "meeting" | "note";
    summary: string;
    date: Date;
    agentId: string;
  }[];
  industry: string;
  website: string;
  idealClientMatch: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    company: { type: String, required: true },
    contacts: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, default: "" },
        role: { type: String, default: "" },
        primary: { type: Boolean, default: false },
      },
    ],
    pipelineStage: {
      type: String,
      enum: ["lead", "qualified", "proposal", "onboarding", "active", "churned"],
      default: "lead",
    },
    qualificationScore: { type: Number, default: 0 },
    notes: { type: String, default: "" },
    interactions: [
      {
        type: { type: String, enum: ["email", "call", "meeting", "note"] },
        summary: { type: String },
        date: { type: Date, default: Date.now },
        agentId: { type: String },
      },
    ],
    industry: { type: String, default: "" },
    website: { type: String, default: "" },
    idealClientMatch: { type: Number, default: 0 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const Client: Model<IClient> =
  mongoose.models.Client || mongoose.model<IClient>("Client", ClientSchema);
