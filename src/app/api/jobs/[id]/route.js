import { connectToDB } from "@/lib/db";
import Job from "../../../../../models/Job";

// PUT: Update a job
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  try {
    await connectToDB();
    const updatedJob = await Job.findByIdAndUpdate(id, body, { new: true });
    return Response.json(updatedJob);
  } catch (error) {
    console.error("PUT /api/jobs/[id] error:", error);
    return new Response("Failed to update job", { status: 500 });
  }
}

// DELETE: Delete a job
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await connectToDB();
    await Job.findByIdAndDelete(id);
    return new Response(JSON.stringify({ message: "Deleted" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("DELETE /api/jobs/[id] error:", error);
    return new Response("Failed to delete job", { status: 500 });
  }
}