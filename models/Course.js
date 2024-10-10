import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
