"use client";
import { useState } from "react";
import { useUser } from '@clerk/nextjs';
import useUserTypeStore from "../store/userTypeStore";

export default function AddCaseModal({ open, onClose, onCaseAdded }) {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hearingDate, setHearingDate] = useState("");
  const [document, setDocument] = useState(null);
  const [documentUrl, setDocumentUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [aiInsight, setAiInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const userId=useUserTypeStore(state=>state.userId);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setDocument(file);
    setDocumentUrl("");
    if (file) {
      setUploading(true);
      setError("");
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/case/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          setDocumentUrl(data.url);
        } else {
          setError("Failed to upload document.");
        }
      } catch (err) {
        setError("Failed to upload document.");
      }
      setUploading(false);
    }
  };

  const handleGenerateInsight = async () => {
    setLoading(true);
    setError("");
    // Simulate AI insight generation
    setTimeout(() => {
      setAiInsight(`AI Summary for: ${title || "Untitled Case"}`);
      setLoading(false);
    }, 1200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log(title,userId)
    try {
      // 2. Create case with document and AI insight
      const res = await fetch("/api/case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          hearingDate,
          document: documentUrl || "",
          aiInsight,
          createdBy: userId,
        }),
      });
      const data = await res.json();
      if (data.case) {
        setSuccess(true);
        onCaseAdded && onCaseAdded(data.case);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1200);
      } else {
        setError(data.error || "Failed to add case.");
      }
    } catch (err) {
      setError("Failed to add case.");
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg flex flex-col gap-5 relative ">
        <h2 className="font-serif text-2xl font-bold text-indigo-800 mb-2">Add New Case</h2>
        <label className="text-sm font-medium text-black">Case Title
          <input type="text" className="mt-1 w-full border rounded-lg px-3 py-2 text-black" value={title} onChange={e => setTitle(e.target.value)} required />
        </label>
        <label className="text-sm font-medium text-black">Description
          <textarea className="mt-1 w-full border rounded-lg px-3 py-2 text-black" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
        </label>
        <label className="text-sm font-medium text-black">Hearing Date
          <input type="date" className="mt-1 w-full border rounded-lg px-3 py-2 text-black" value={hearingDate} onChange={e => setHearingDate(e.target.value)} required />
        </label>
        <label className="text-sm font-medium text-black">Upload Document
          <input type="file" className="mt-1 w-full text-black" onChange={handleFileChange} />
        </label>
        {uploading && <div className="text-blue-600 text-xs">Uploading...</div>}
        {documentUrl && (
          <div className="text-green-600 text-xs mt-1">
            Uploaded: <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="underline">View Document</a>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button type="button" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition text-black" onClick={handleGenerateInsight} disabled={loading || !title}>
            {loading ? "Generating..." : "Generate AI Insight"}
          </button>
          {aiInsight && <span className="text-green-600 text-xs ml-2">AI Insight Ready</span>}
        </div>
        {aiInsight && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">{aiInsight}</div>
        )}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">Case added successfully!</div>}
        <div className="flex gap-3 mt-2">
          <button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-semibold shadow hover:scale-105 transition" disabled={loading || uploading } onClick={handleSubmit}>
            {loading ? "Saving..." : "Add Case"}
          </button>
          <button type="button" className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg font-semibold shadow hover:bg-slate-200 transition" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 