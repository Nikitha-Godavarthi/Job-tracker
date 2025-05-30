// models/Job.js
import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    location: String,
    status: String,
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
