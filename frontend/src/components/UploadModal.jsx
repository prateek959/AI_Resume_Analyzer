import { useState } from "react";
import api from "../api/axios";
import { UploadCloud, X } from "lucide-react";

export default function UploadModal({ onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(""); 

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  const handleUpload = async () => {
    setWarning(""); // reset warning

    if (!file) {
      setWarning("Please select a file!");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setWarning("File too large! Maximum allowed size is 5 MB.");
      setTimeout(() => {
        onClose(); // go back to dashboard
      }, 2000);
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const res = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Success
      setWarning(""); 
      if (onSuccess) {
        onSuccess({
          _id: res.data.resumeID,
          name: file.name,
        });
      }
      onClose(); // close modal on success
    } catch (err) {
      console.log("Upload error:", err.response?.data || err);

      const msg =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Upload failed";

      setWarning(msg); // show message in modal

      // Automatically close modal after showing warning
      setTimeout(() => {
        onClose();
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  // Drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    if (!loading && e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setWarning(""); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white w-full max-w-md p-8 rounded-3xl shadow-2xl backdrop-blur-sm transform transition-all duration-300 scale-100 hover:scale-105">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upload Resume</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !loading && document.getElementById("fileInput").click()}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 mb-4 cursor-pointer transition-colors duration-300 
            ${file ? "border-green-500" : "border-gray-600 hover:border-indigo-500"}`}
        >
          {!file && (
            <>
              <UploadCloud size={40} className="mb-2 text-indigo-500" />
              <p className="text-gray-400 text-center">
                Drag & drop your resume here<br />or click to select
              </p>
            </>
          )}
          {file && <p className="mt-3 text-green-400 font-medium">{file.name}</p>}
        </div>

        {/* Warning message */}
        {warning && (
          <div className="mb-4 p-3 bg-red-700/70 text-red-100 rounded-lg text-sm">
            {warning}
          </div>
        )}

        {/* Hidden input for click */}
        <input
          type="file"
          id="fileInput"
          accept=".pdf,.doc,.docx"
          disabled={loading || !!file} 
          onChange={(e) => {
            setFile(e.target.files[0]);
            setWarning(""); 
          }}
          className="hidden"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 bg-gray-700 rounded-xl hover:bg-gray-600 transition-all duration-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 active:scale-95"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
