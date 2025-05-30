"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function JobTracker() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    status: "Applied",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [committedSearch, setCommittedSearch] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        if (!res.ok) {
          const err = await res.text();
          console.error("Failed to fetch jobs:", err); // log response error
          return;
        }
        const data = await res.json();
        console.log("Loaded jobs:", data);
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error); // log fetch error
      }
    };
  
    fetchJobs();
  }, []);
  
  

  const handleSubmit = async () => {
    if (!form.title || !form.company || !form.location) return;
  
    try {
      let res;
      if (editingIndex !== null) {
        // EDIT: send PUT
        const jobId = jobs[editingIndex]._id;
        res = await fetch(`/api/jobs/${jobId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        // ADD: send POST
        res = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
  
      if (!res.ok) {
        const err = await res.text();
        console.error("Failed to submit job:", err);
        return;
      }
  
      const updatedJob = await res.json();
  
      const newJobs = [...jobs];
      if (editingIndex !== null) {
        newJobs[editingIndex] = updatedJob;
      } else {
        newJobs.unshift(updatedJob);
      }
  
      setJobs(newJobs);
      setForm({ title: "", company: "", location: "", status: "Applied" });
      setEditingIndex(null);
      setSearchTerm("");
      setCommittedSearch("");
    } catch (error) {
      console.error("Error submitting job:", error);
    }
  };
  
  

  const handleEdit = (index) => {
    setForm(jobs[index]);
    setEditingIndex(index);
  };

  const handleDelete = async (index) => {
    const jobId = jobs[index]._id;
  
    const res = await fetch(`/api/jobs/${jobId}`, {
      method: "DELETE",
    });
  
    if (res.ok) {
      const updatedJobs = [...jobs];
      updatedJobs.splice(index, 1);
      setJobs(updatedJobs);
    } else {
      console.error("Failed to delete:", await res.text());
    }
  };
  
  

  return (
    <main className="min-h-screen bg-slate-50 text-black p-6"
    style={{ backgroundImage: "url('/bg.png')" }}>
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center">Job Application Tracker</h1>

      {/* Container Card: Only form/filter section */}
      <div className="bg-white/60 backdrop-blur-md border border-white/40 shadow-lg rounded-2xl p-6"
>

        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="w-full md:w-1/2 flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search jobs by title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setCommittedSearch(searchTerm);
              }}
            />
            <Button
              variant="outline"
              onClick={() => setCommittedSearch(searchTerm)}
              className="px-3 bg-transparent hover:bg-white/20"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>

          <div className="self-start md:self-auto ml-auto">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="Interview">Interview</SelectItem>
                <SelectItem value="Offer">Offer</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full mb-8">
          <Input
            placeholder="Job Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full"
          />
          <Input
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full"
          />
          <Input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full"
          />
          <Select
            value={form.status}
            onValueChange={(value) => setForm({ ...form, status: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Interview">Interview</SelectItem>
              <SelectItem value="Offer">Offer</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSubmit}
          className="mb-4"
          disabled={!form.title || !form.company || !form.location}
        >
          <Plus className="w-4 h-4 mr-2" /> {editingIndex !== null ? "Update Job" : "Add Job"}
        </Button>
      </div>

      {/* OUTSIDE the container: Job List */}
      <section className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs
          .filter(
            (job) =>
              (statusFilter === "All" || job.status === statusFilter) &&
              (job.title.toLowerCase().includes(committedSearch.toLowerCase()) ||
                job.company.toLowerCase().includes(committedSearch.toLowerCase()))
          )
          .map((job, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold mb-1">{job.title}</h2>
                <p className="text-gray-700">{job.company}</p>
                <p className="text-gray-500 text-sm mb-2">{job.location}</p>
                <p className="text-sm text-indigo-700 font-medium mb-4">Status: {job.status}</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleEdit(index)}>
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </section>
    </main>
  );
}
