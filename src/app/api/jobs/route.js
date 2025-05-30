// app/api/jobs/route.js
import { connectToDB } from "@/lib/db";
import Job from "../../../../models/Job";

export async function GET() {
  try {
    await connectToDB();
    const jobs = await Job.find().sort({ createdAt: -1 });
    return Response.json(jobs);
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    return new Response("Failed to load jobs", { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.title || !body.company || !body.location || !body.status) {
      return new Response("Missing required fields", { status: 400 });
    }

    await connectToDB();
    const newJob = await Job.create(body);
    return Response.json(newJob);
  } catch (error) {
    console.error("POST /api/jobs error:", error);
    return new Response("Failed to create job", { status: 500 });
  }
}
