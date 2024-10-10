"use client";
import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [grade, setGrade] = useState("");
  const [credits, setCredits] = useState(0);
  const [editId, setEditId] = useState(null);

  const fetchCourses = async () => {
    const res = await fetch("/api/courses/course", { cache: "no-store" });
    const data = await res.json();
    setCourses(data);
  };
  useEffect(() => {
    fetchCourses();
  }, []);

  const calculateGPA = () => {
    const gradePoints = {
      A: 4.0,
      B: 3.0,
      C: 2.0,
      D: 1.0,
      F: 0.0,
    };

    let totalCredits = 0;
    let totalPoints = 0;

    courses.forEach((course) => {
      totalCredits += course.credits;
      totalPoints += gradePoints[course.grade] * course.credits;
    });

    return totalCredits ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  const addOrUpdateCourse = async () => {
    const newCourse = { name: courseName, grade, credits: Number(credits) };

    if (editId) {
      await fetch(`/api/courses/update/${editId}`, {
        cache: "no-store",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      });

      setCourses(
        courses.map((course) =>
          course._id === editId ? { ...course, ...newCourse } : course
        )
      );
    } else {
      const res = await fetch("/api/courses/create", {
        cache: "no-store",

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      });

      const data = await res.json();
      setCourses([...courses, data]);
    }
    fetchCourses();
    setCourseName("");
    setGrade("");
    setCredits(0);
    setEditId(null);
  };

  const deleteCourse = async (id) => {
    await fetch(`/api/courses/delete/${id}`, {
      cache: "no-store",
      method: "DELETE",
    });
    setCourses(courses.filter((course) => course._id !== id));
    fetchCourses();
  };

  const startEditCourse = (course) => {
    setCourseName(course.name);
    setGrade(course.grade);
    setCredits(course.credits);
    setEditId(course._id);
    fetchCourses();
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl font-bold text-center mb-4">GPA Calculator</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Grade (A-F)"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Credits"
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addOrUpdateCourse}
          disabled={!courseName || !grade || credits <= 0}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          {editId ? "Update Course" : "Add Course"}
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Courses</h2>

      {/* Courses Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-2 border">Course Name</th>
            <th className="p-2 border">Grade</th>
            <th className="p-2 border">Credits</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id} className="border-b">
              <td className="p-2 border">{course.name}</td>
              <td className="p-2 border">{course.grade}</td>
              <td className="p-2 border">{course.credits}</td>
              <td className="p-2 border flex justify-center space-x-4">
                <button
                  onClick={() => startEditCourse(course)}
                  className="text-blue-600 hover:text-blue-800 transition duration-200"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => deleteCourse(course._id)}
                  className="text-red-600 hover:text-red-800 transition duration-200"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mt-4">
        Current GPA: {calculateGPA()}
      </h2>
    </div>
  );
}
