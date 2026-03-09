import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export interface IConversation extends Document {
  agentId: string;
  messages: IMessage[];
  context: {
    projectId: mongoose.Types.ObjectId;
    clientId: mongoose.Types.ObjectId;
    metadata: Record<string, unknown>;
  };
  projectRef: mongoose.Types.ObjectId;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    agentId: { type: String, required: true },
    messages: [
      {
        role: { type: String, enum: ["user", "assistant", "system"], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    context: {
      projectId: { type: Schema.Types.ObjectId, ref: "Project" },
      clientId: { type: Schema.Types.ObjectId, ref: "Client" },
      metadata: { type: Schema.Types.Mixed, default: {} },
    },
    projectRef: { type: Schema.Types.ObjectId, ref: "Project" },
    userId: { type: String, default: "" },
    title: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);
