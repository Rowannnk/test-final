import dbConnect from "@/libs/db";
import Course from "@/models/Course";

// GET: Fetch a course by ID
export async function GET(req, { params }) {
  const { id } = params;
  await dbConnect();

  try {
    const course = await Course.findById(id);
    if (!course) {
      return new Response(JSON.stringify({ message: "Course not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(course), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error fetching course" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// PUT: Update a course by ID
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

// DELETE: Delete a course by ID
export async function DELETE(req, { params }) {
  const { id } = params;
  await dbConnect();

  try {
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return new Response(JSON.stringify({ message: "Course not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error deleting course" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
