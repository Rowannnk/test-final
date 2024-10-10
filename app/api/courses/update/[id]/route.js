import dbConnect from "@/libs/db";
import Course from "@/models/Course";

export async function PUT(req, { params }) {
  const { id } = params;
  await dbConnect();

  const { name, grade, credits } = await req.json();

  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { name, grade, credits },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return new Response(JSON.stringify({ message: "Course not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updatedCourse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error updating course" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
