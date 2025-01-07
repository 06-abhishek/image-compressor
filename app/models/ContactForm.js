import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    sharedOn: { type: String, required: true },
  },
  { timestamps: true }
);

// Check if the model is already registered to avoid overwriting errors
const ContactForm =
  mongoose.models.ContactForm || mongoose.model("ContactForm", ContactSchema);

export default ContactForm;
