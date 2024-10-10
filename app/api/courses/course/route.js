import dbConnect from "@/libs/db";
import Course from "@/models/Course";

export async function GET(req) {
  await dbConnect();

  try {
    const courses = await Course.find();
    return new Response(JSON.stringify(courses), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error fetching courses" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
