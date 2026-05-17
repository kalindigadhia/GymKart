import React from "react";
import { useNavigate } from "react-router-dom";

function getStoredUser() {
  try {
    const storedData = JSON.parse(localStorage.getItem("user"));
    return storedData?.user || storedData;
  } catch {
    return null;
  }
}

export default function Profile() {
  const navigate = useNavigate();
  const user = getStoredUser();

  if (!user) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-semibold mb-4">No profile found</h1>
        <p className="text-gray-600 mb-6">Please login first to see your profile details.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-orange-500 text-white px-5 py-2 rounded-lg"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-3xl shadow-lg mt-8">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      <p className="text-gray-500 mb-6">This is your user information after login.</p>

      <div className="space-y-4 text-gray-800">
        <div className="flex justify-between border-b pb-3">
          <span className="font-semibold">Name</span>
          <span>{user.name || "-"}</span>
        </div>
        <div className="flex justify-between border-b pb-3">
          <span className="font-semibold">Email</span>
          <span>{user.email || "-"}</span>
        </div>
        <div className="flex justify-between border-b pb-3">
          <span className="font-semibold">Role</span>
          <span>{user.role || "Customer"}</span>
        </div>
        {user.phone && (
          <div className="flex justify-between border-b pb-3">
            <span className="font-semibold">Phone</span>
            <span>{user.phone}</span>
          </div>
        )}
        {user.address && (
          <div className="flex justify-between border-b pb-3">
            <span className="font-semibold">Address</span>
            <span>{user.address}</span>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg"
        >
          Back to Home
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
          className="bg-red-500 text-white px-5 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
