import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import UploadModal from "../components/UploadModal";
import { UserCircle, LogOut } from "lucide-react";
import api from "../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/resume/list");
      setResumes(res.data.resumes || []);
    } catch (err) {
      console.log("Resume fetch error:", err);
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetchResumes();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleUploadSuccess = () => {
    fetchResumes();
    setShowUpload(false);
  };

  const handleDeleteSuccess = () => {
    setSelectedResume(null);
    fetchResumes();
  };

  return (
    <div className="h-screen w-full flex bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden">

      <div className="w-72 h-full border-r border-gray-800 bg-gray-900/80 backdrop-blur-md">
        <Sidebar
          resumes={resumes}
          selected={selectedResume}
          onSelect={setSelectedResume}
          onAdd={() => setShowUpload(true)}
          onDeleteSuccess={handleDeleteSuccess}
          loading={loading}
        />
      </div>

      <div className="flex-1 flex flex-col">

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/70 backdrop-blur-md"
        >
          <div>
            <h1 className="text-2xl font-bold">Resume AI Assistant</h1>
            <p className="text-sm text-gray-400">
              Ask smart questions about your resume
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-xl">
              <UserCircle size={20} />
              <span className="text-sm">My Account</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </motion.div>

        <div className="flex-1 relative">
          {selectedResume ? (
            <ChatWindow resume={selectedResume} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-4"
              >
                Welcome to Resume AI 🚀
              </motion.h2>

              <p className="text-gray-400 max-w-xl">
                Upload your resume and start chatting with AI
              </p>

              <button
                onClick={() => setShowUpload(true)}
                className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl font-semibold"
              >
                Upload Resume
              </button>
            </div>
          )}
        </div>
      </div>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}
