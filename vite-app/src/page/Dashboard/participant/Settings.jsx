import{ useState } from "react";
import { FiUser, FiCheckCircle } from "react-icons/fi";
import formatDate from "./FromateDate";

export default function ProfileSettings({ data }) {
  const [profile, setProfile] = useState(data.profile);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const validateProfile = () => {
    const newErrors = {};

    if (!profile.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!profile.rollNo.trim()) {
      newErrors.rollNo = "Roll number is required";
    }

    if (!profile.email.trim() || !/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = "Valid email is required";
    }

    if (!profile.organization.trim()) {
      newErrors.organization = "Organization is required";
    }

    if (!profile.program.trim()) {
      newErrors.program = "Program is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateProfile()) return;

    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 3000);

    // Here you would typically send the profile data to your backend
    console.log("Saving profile:", profile);
  };

  const updateProfile = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  return (
    <div className="p-8 flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Profile Settings
          </h2>
          <p className="text-gray-400">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-800 shadow-xl">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiUser className="text-white text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  {profile.name}
                </h3>
                <p className="text-gray-400 mb-2">{profile.rollNo}</p>
                <p className="text-blue-400 text-sm">{profile.program}</p>
                <p className="text-gray-500 text-sm mt-4">
                  Member since {formatDate(profile.joinDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-800 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FiUser />
                  Personal Information
                </h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <FiCheckCircle />
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => updateProfile("name", e.target.value)}
                      disabled={!isEditing}
                      className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      value={profile.rollNo}
                      onChange={(e) => updateProfile("rollNo", e.target.value)}
                      disabled={!isEditing}
                      className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                    />
                    {errors.rollNo && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.rollNo}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => updateProfile("email", e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={profile.organization}
                      onChange={(e) =>
                        updateProfile("organization", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                    />
                    {errors.organization && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.organization}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">
                      Program
                    </label>
                    <select
                      value={profile.program}
                      onChange={(e) => updateProfile("program", e.target.value)}
                      disabled={!isEditing}
                      className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                    >
                      <option value="B.Tech Computer Science">
                        B.Tech Computer Science
                      </option>
                      <option value="B.Tech Information Technology">
                        B.Tech Information Technology
                      </option>
                      <option value="B.Tech Electronics">
                        B.Tech Electronics
                      </option>
                      <option value="B.Tech Mechanical">
                        B.Tech Mechanical
                      </option>
                      <option value="B.Tech Civil">B.Tech Civil</option>
                      <option value="BCA">BCA</option>
                      <option value="MCA">MCA</option>
                    </select>
                    {errors.program && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.program}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">
                      Semester
                    </label>
                    <select
                      value={profile.semester}
                      onChange={(e) =>
                        updateProfile("semester", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={`${sem}th`}>
                          {sem}th Semester
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {saved && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
                  Profile updated successfully!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
