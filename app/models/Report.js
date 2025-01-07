import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    // screenshot: { type: String, required: true },
    description: { type: String, required: true },
    sharedOn: { type: String, required: true },
  },
  { timestamps: true }
);

const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);
export default Report;
