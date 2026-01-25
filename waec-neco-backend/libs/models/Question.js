import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  exam: String,
  subject: String,
  type: String,
  year: Number,
  text: String,
  options: [String],
  answer: String,
  images: [String],
  isTest: Boolean,
});

export default mongoose.models.Question ||
  mongoose.model("Question", QuestionSchema);
