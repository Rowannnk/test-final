import dbConnect from "@/libs/db";
import Course from "@/models/Course";

export async function POST(req) {
  await dbConnect();

  const { name, grade, credits } = await req.json();
  console.log(name);

  if (!name || !grade || credits < 0) {
    return new Response(JSON.stringify({ message: "Invalid course data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const newCourse = new Course({ name, grade, credits });

  try {
    const savedCourse = await newCourse.save();
    return new Response(JSON.stringify(savedCourse), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error creating course" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
