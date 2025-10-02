import {
  FiHome,
  FiAward,
  FiBarChart2,
  FiCalendar,
  FiSettings,
  FiLogOut,
  FiTrendingUp,
} from "react-icons/fi";
import mockParticipantData from "./mockdata";

export default function ParticipantSidebar({ onNavigate, activePage }) {
  const menu = [
    { key: "dashboard", label: "Dashboard", icon: FiHome },
    { key: "join", label: "Join Quiz", icon: FiAward },
    { key: "results", label: "My Results", icon: FiBarChart2 },
    { key: "upcoming", label: "Upcoming", icon: FiCalendar },
    { key: "settings", label: "Profile", icon: FiSettings },
    { key: "logout", label: "Logout", icon: FiLogOut },
  ];

  return (
    <aside className="bg-gradient-to-b from-zinc-900 to-black h-full w-64 p-6 flex flex-col gap-1 border-r border-zinc-800 shadow-2xl">
      <div className="mb-8 pb-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Quizzy
          </h1>
        </div>
        <p className="text-gray-500 text-xs mt-2 ml-1">Participant Dashboard</p>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <Icon className="text-lg" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <FiTrendingUp className="text-white text-lg" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold">Avg. Score</p>
            <p className="text-green-400 text-lg font-bold">
              {mockParticipantData.stats.averageScore}%
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
