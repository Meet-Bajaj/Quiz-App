import {
  FiHome,
  FiPlusCircle,
  FiList,
  FiBarChart2,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

export default function Sidebar({ onNavigate, activePage }) {
  const menu = [
    { key: "dashboard", label: "Dashboard", icon: FiHome },
    { key: "create", label: "Create Quiz", icon: FiPlusCircle },
    { key: "list", label: "Quiz List", icon: FiList },
    { key: "results", label: "Results", icon: FiBarChart2 },
    { key: "settings", label: "Settings", icon: FiSettings },
    { key: "logout", label: "Logout", icon: FiLogOut },
  ];

  return (
    <aside className="bg-gradient-to-br from-black via-zinc-950 to-black  h-full w-64 p-6 flex flex-col gap-1 border-r border-gray-800 shadow-2xl">
      <div className="mb-8 pb-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black border border-white rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">Q</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Quizzy</h1>
        </div>
        <p className="text-gray-500 text-xs mt-2 ml-1">Host Dashboard</p>
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
                  ? "bg-white text-black font-bold shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Icon className={`text-lg ${isActive ? "text-black" : "text-gray-400"}`} />
              <span className={`${isActive ? "text-black" : ""} font-medium`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
