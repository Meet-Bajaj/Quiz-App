import { useNavigate } from "react-router-dom";

const Navbar = ({ isRequired = true }) => {
  const navigate = useNavigate();

  const handleLogin = () => navigate("/login");
  const handleLogoClick = () => navigate("/");

  return (
    <nav
      className="w-full text-white flex justify-between items-center px-6 sm:px-12 py-4 sm:py-6 fixed top-0 left-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <button
        onClick={handleLogoClick}
        className="p-2 text-xl sm:text-2xl font-bold cursor-pointer hover:text-gray-200 transition-colors focus:outline-none rounded"
        aria-label="Navigate to home page"
      >
        Quizzy
      </button>

      <div className="flex items-center space-x-2 sm:space-x-4">
        {isRequired && <Button onClick={handleLogin} />}
      </div>
    </nav>
  );
};

const Button = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="py-2 px-4 sm:px-8 border-2 border-white text-white rounded-full font-medium text-sm sm:text-base
       hover:bg-white hover:text-black transition-all duration-200 transform hover:scale-105 active:scale-95"
      aria-label="Login to your account"
    >
      Login
    </button>
  );
};

export default Navbar;
