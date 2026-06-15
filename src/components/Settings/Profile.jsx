import React, { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa6";
import { GoUpload } from "react-icons/go";
import { FiSave } from "react-icons/fi";
import { authService } from "@/services/api";

const Profile = ({ user }) => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    age: "",
    phoneNumber: "",
    occupation: "",
    lastName: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || "",
        email: user.email || "",
        age: user.age || "",
        phoneNumber: user.phone_number || "",
        occupation: user.occupation || "",
        lastName: user.last_name || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setSaveMessage("");

    try {
      await authService.updateProfile({
        username: profile.username,
        email: profile.email,
        last_name: profile.lastName,
        age: profile.age ? Number(profile.age) : undefined,
        phone_number: profile.phoneNumber,
        occupation: profile.occupation,
        bio: profile.bio,
      });
      setSaveMessage("Profile saved successfully!");
    } catch (error) {
      setSaveMessage(error?.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-x-3 items-center">
        <FaRegUser size={22} className="text-green-600 flex-shrink-0" />
        <h1 className="text-[20px] md:text-[22px] font-semibold">
          Profile Information
        </h1>
      </div>
      <p className="text-sm text-gray-500 mt-1">
        Update your account profile information.
      </p>

      {saveMessage && (
        <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
          saveMessage.includes("successfully")
            ? "bg-green-50 text-green-700 border-l-4 border-green-600"
            : "bg-red-50 text-red-700 border-l-4 border-red-600"
        }`}>
          {saveMessage}
        </div>
      )}

      <div className="flex items-center gap-x-4 mt-5">
        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-2xl md:text-4xl flex-shrink-0">
          {profile.username?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-x-2 px-3 py-2 border border-gray-200 rounded-lg w-fit bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
            <GoUpload size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Change Photo
            </span>
            <input type="file" className="hidden" accept="image/*" />
          </label>
          <p className="text-xs text-gray-400">
            JPG, PNG or GIF. Max size of 2MB.
          </p>
        </div>
      </div>

      <div className="mt-7">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-[14px] text-gray-700 mb-1">
                Username
              </label>
              <input
                name="username"
                value={profile.username}
                onChange={handleChange}
                type="text"
                className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
                placeholder="Username"
              />
            </div>
            <div>
              <label className="block font-medium text-[14px] text-gray-700 mb-1">
                Email
              </label>
              <input
                name="email"
                value={profile.email}
                onChange={handleChange}
                type="email"
                className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
                placeholder="Email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-[14px] text-gray-700 mb-1">
                Age
              </label>
              <input
                name="age"
                value={profile.age}
                onChange={handleChange}
                type="number"
                className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
                placeholder="Age"
              />
            </div>
            <div>
              <label className="block font-medium text-[14px] text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
                type="tel"
                className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
                placeholder="Phone Number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-[14px] text-gray-700 mb-1">
                Occupation
              </label>
              <input
                name="occupation"
                value={profile.occupation}
                onChange={handleChange}
                type="text"
                className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
                placeholder="Occupation"
              />
            </div>
            <div>
              <label className="block font-medium text-[14px] text-gray-700 mb-1">
                Last Name
              </label>
              <input
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                type="text"
                className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
                placeholder="Last Name"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-[14px] text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              className="rounded-lg p-2.5 w-full border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm resize-none transition"
              placeholder="Tell us a little about yourself..."
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-x-2 bg-green-600 text-white py-2 px-5 rounded-xl text-sm md:text-[15px] font-medium hover:bg-green-700 transition-colors mt-2 disabled:opacity-60"
          >
            <FiSave size={16} />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
