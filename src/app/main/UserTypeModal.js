'use client';
import { useState, useEffect } from "react";
import { useUser } from '@clerk/nextjs';
import useUserTypeStore from "../store/userTypeStore";

const USER_TYPES = ["Lawyer", "Client", "Admin"];

export default function UserTypeModal({ open, onClose }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useUser();
  const setUserType = useUserTypeStore(state => state.setUserType);
  const setUsername = useUserTypeStore(state => state.setUsername);

  useEffect(() => {
    async function fetchUserProfile() {
      setLoading(true);
      setError("");
      if (!user?.emailAddresses?.[0]?.emailAddress) {
        setLoading(false);
        return;
      }
      const email = user.emailAddresses[0].emailAddress;
      try {
        const res = await fetch(`/api/user?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.user) {
          setUserType(data.user.role);
          setUsername(data.user.name);
          onClose();
        }
      } catch (err) {
        setError("Failed to fetch user profile.");
      }
      setLoading(false);
    }
    if (open) fetchUserProfile();
  }, [user, open, setUserType, setUsername, onClose]);

  const handleSelect = (type) => {
    setSelected(type);
    setError("");
  };

  const handleConfirm = async () => {
    if (!selected || !user) {
      setError("Please select a role.");
      return;
    }
    setLoading(true);
    setError("");
    const email = user.emailAddresses[0].emailAddress;
    const name = user.fullName || user.username || user.firstName || "";
    const avatar = user.imageUrl;
    const clerkId = user.id;
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, role: selected, avatar, clerkId }),
      });
      const data = await res.json();
      if (data.user) {
        setUserType(data.user.role);
        setUsername(data.user.name);
        onClose();
      } else {
        setError("Failed to create user.");
      }
    } catch (err) {
      setError("Failed to create user.");
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <h2 className="font-serif text-2xl font-bold text-indigo-800 mb-4">Select Your User Type</h2>
        <p className="text-slate-600 mb-6 text-center">Please choose your role to personalize your dashboard experience.</p>
        {loading ? (
          <div className="w-full flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
            <div className="text-slate-500">Loading...</div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 w-full">
              {USER_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => handleSelect(type)}
                  className={`w-full px-4 py-2 rounded-lg border text-lg font-medium transition
                    ${selected === type ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50"}`}
                >
                  {type}
                </button>
              ))}
            </div>
            {error && <div className="text-red-600 mt-4 text-sm">{error}</div>}
            <button
              className="mt-8 w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-2 rounded-lg font-semibold shadow hover:scale-105 transition disabled:opacity-50"
              onClick={handleConfirm}
              disabled={!selected || loading}
            >
              {loading ? "Saving..." : "Confirm"}
            </button>
          </>
        )}
      </div>
    </div>
  );
} 