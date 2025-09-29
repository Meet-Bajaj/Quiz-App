import { FiSettings, FiCheck, FiSave, FiUsers, FiCheckCircle } from "react-icons/fi";
import React, { useState } from "react";

export default function Settings() {
  const [settings, setSettings] = useState({
    hostName: "Quiz Host",
    email: "host@example.com",
    organization: "University",
    passingPercentage: 60,
    maxParticipants: 100,
    defaultQuizDuration: 60,
    timezone: "UTC",
    autoPublishResults: true,
    allowLateSubmissions: false,
    showCorrectAnswers: true,
    emailNotifications: true,
  });

  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
    setSaved(false);
  };

  const validateSettings = () => {
    const newErrors = {};
    
    if (!settings.hostName.trim()) newErrors.hostName = "Host name is required";
    if (!settings.email.trim()) newErrors.email = "Email is required";
    if (!settings.passingPercentage || settings.passingPercentage < 0 || settings.passingPercentage > 100) {
      newErrors.passingPercentage = "Passing percentage must be between 0 and 100";
    }
    if (!settings.maxParticipants || settings.maxParticipants < 1) {
      newErrors.maxParticipants = "Max participants must be at least 1";
    }
    if (!settings.defaultQuizDuration || settings.defaultQuizDuration < 1) {
      newErrors.defaultQuizDuration = "Quiz duration must be at least 1 minute";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateSettings()) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="p-4 md:p-8 flex-1 overflow-y-auto bg-zinc-950 text-white">
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">Settings</h2>
        <p className="text-zinc-400">Manage your quiz platform preferences</p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Profile Information */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2 text-white">
            <FiUsers />
            Profile Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-zinc-300 mb-2 font-medium">Host Name *</label>
              <input
                type="text"
                value={settings.hostName}
                onChange={(e) => updateSetting("hostName", e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white"
              />
              {errors.hostName && (
                <p className="text-red-400 text-sm mt-1">{errors.hostName}</p>
              )}
            </div>
            <div>
              <label className="block text-zinc-300 mb-2 font-medium">Email *</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => updateSetting("email", e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-zinc-300 mb-2 font-medium">Organization</label>
              <input
                type="text"
                value={settings.organization}
                onChange={(e) => updateSetting("organization", e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white"
              />
            </div>
          </div>
        </div>

        {/* Quiz Configuration */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2 text-white">
            <FiSettings />
            Quiz Configuration
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 mb-2 font-medium">Passing Percentage *</label>
                <input
                  type="number"
                  value={settings.passingPercentage}
                  onChange={(e) => updateSetting("passingPercentage", parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white"
                  min="0"
                  max="100"
                />
                {errors.passingPercentage && (
                  <p className="text-red-400 text-sm mt-1">{errors.passingPercentage}</p>
                )}
              </div>
              <div>
                <label className="block text-zinc-300 mb-2 font-medium">Max Participants *</label>
                <input
                  type="number"
                  value={settings.maxParticipants}
                  onChange={(e) => updateSetting("maxParticipants", parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white"
                  min="1"
                />
                {errors.maxParticipants && (
                  <p className="text-red-400 text-sm mt-1">{errors.maxParticipants}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 mb-2 font-medium">Default Quiz Duration (minutes) *</label>
                <input
                  type="number"
                  value={settings.defaultQuizDuration}
                  onChange={(e) => updateSetting("defaultQuizDuration", parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white"
                  min="1"
                />
                {errors.defaultQuizDuration && (
                  <p className="text-red-400 text-sm mt-1">{errors.defaultQuizDuration}</p>
                )}
              </div>
              <div>
                <label className="block text-zinc-300 mb-2 font-medium">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => updateSetting("timezone", e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">EST</option>
                  <option value="PST">PST</option>
                  <option value="IST">IST</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2 text-white">
            <FiCheckCircle />
            Preferences
          </h3>
          <div className="space-y-3">
            {[
              {
                key: "autoPublishResults",
                label: "Auto-publish Results",
                description: "Automatically publish results when quiz ends",
              },
              {
                key: "allowLateSubmissions",
                label: "Allow Late Submissions",
                description: "Participants can submit after deadline",
              },
              {
                key: "showCorrectAnswers",
                label: "Show Correct Answers",
                description: "Display correct answers after quiz completion",
              },
              {
                key: "emailNotifications",
                label: "Email Notifications",
                description: "Receive email notifications for quiz events",
              },
            ].map(({ key, label, description }) => (
              <label
                key={key}
                className="flex items-center justify-between p-3 md:p-4 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors"
              >
                <div>
                  <p className="text-white font-medium text-sm md:text-base">{label}</p>
                  <p className="text-zinc-400 text-xs md:text-sm">{description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings[key]}
                  onChange={(e) => updateSetting(key, e.target.checked)}
                  className="w-4 h-4 md:w-5 md:h-5 accent-white bg-zinc-700 border-zinc-600 rounded focus:ring-white focus:ring-2"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-3 md:py-4 bg-white text-zinc-900 rounded-lg font-semibold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 border border-zinc-300 text-sm md:text-base"
        >
          {saved ? <FiCheck className="text-lg md:text-xl" /> : <FiSave className="text-lg md:text-xl" />}
          {saved ? "Settings Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
