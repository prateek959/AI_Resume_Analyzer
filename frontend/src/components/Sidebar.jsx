import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Sidebar({ resumes: parentResumes, onSelect, selected, onAdd, loading }) {
  const [resumes, setResumes] = useState([]);

  // Sync parentResumes if passed from Dashboard
  useEffect(() => {
    if (parentResumes) setResumes(parentResumes);
  }, [parentResumes]);

  // Fetch resumes from API (optional if parent passes them)
  const fetchResumes = async () => {
    try {
      const res = await api.get("/resume/list");
      setResumes(res.data.resumes || []);
    } catch (err) {
      console.log("Sidebar fetch error:", err);
      setResumes([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/resume/delete/${id}`);

      // Remove from state
      const updated = resumes.filter((r) => r._id !== id);
      setResumes(updated);

      // If deleted resume is currently selected, clear selection
      if (selected?._id === id) {
        onSelect(null);
      }
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  return (
    <div className="sidebar flex flex-col p-2">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">My Resumes</h2>
        <button
          onClick={onAdd}
          className="text-blue-500 font-semibold"
        >
          + Add
        </button>
      </div>

      {loading && <p className="text-gray-400 text-sm">Loading...</p>}

      <div className="flex-1 overflow-y-auto space-y-2">
        {Array.isArray(resumes) && resumes.length > 0 ? (
          resumes.map((resume) => (
            <div
              key={resume._id}
              className={`p-2 rounded cursor-pointer flex justify-between items-center ${
                selected?._id === resume._id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-200 hover:bg-gray-700"
              }`}
              onClick={() => onSelect(resume)}
            >
              <span>{resume.name || `Resume ${resume._id.slice(-4)}`}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(resume._id);
                }}
                className="text-red-500 hover:text-red-400"
              >
                ❌
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm text-center mt-4">
            No resumes found
          </p>
        )}
      </div>
    </div>
  );
}
