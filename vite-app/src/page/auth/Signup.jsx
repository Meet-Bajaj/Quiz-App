import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link , useNavigate} from "react-router-dom";
import Prism from "../components/Prism";
import Footer from "../components/Footer";
import Navbar from "../components/NavAuth";

const Signup = React.memo(() => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log("Form data:", data);

    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
    navigate("/signup/select-role");
  };
  const attributes = {
    animationType: "rotate",
    timeScale: 0.5,
    height: 3.5,
    baseWidth: 5.5,
    scale: 3.6,
    hueShift: 0,
    colorFrequency: 1,
    noise: 0,
    glow: 1,
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center h-screen w-screen p-4 bg-black/20 backdrop-blur-sm  ">
      <Navbar isRequired={false} />
      <div className="w-full h-full absolute -z-10 opacity-50 md:flex hidden">
        <Prism {...attributes} />
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-center w-full max-w-6xl rounded-xl shadow-2xl bg-zinc-950 min-h-[500px] overflow-hidden">
        {/* Left Section - Welcome Message */}
        <div className="flex-1 p-8 lg:p-12 text-center lg:text-left w-full border-b lg:border-b-0 lg:border-r border-gray-800">
          <h2 className="text-4xl lg:text-7xl bricolage font-bold text-white mb-4">
            Sign Up
          </h2>
          <Link
            to="/login"
            className="inline-block group"
            aria-label="Navigate to login page"
          >
            <p className="text-white text-sm lg:text-base pt-sans">
              Already have an account?{" "}
              <span className="text-blue-400 hover:text-blue-300 group-hover:underline transition-colors">
                Log In
              </span>
            </p>
          </Link>
          <p className="text-gray-400 mt-6">
            Join us today and start your journey with our quiz platform!
          </p>
        </div>

        {/* Right Section - Form */}
        <div className="flex-1 p-8 lg:p-12 w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full name Field */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Full Name"
                autoComplete="name"
                className={`w-full p-3 bg-transparent border-b-2 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 input-transparent rounded-sm ${
                  errors.fullName ? "border-red-500 focus:border-red-400" : "border-gray-600 focus:border-white focus:scale-105"
                }`}
                {...register("fullName", {
                  required: "Full Name is required",
                  minLength: {
                    value: 3,
                    message: "Full Name must be at least 3 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Full Name must be less than 20 characters",
                  },
                })}
                aria-invalid={errors.fullName ? "true" : "false"}
              />
              {errors.fullName && (
                <p className="text-red-400 text-sm animate-fadeIn" role="alert">
                  {errors.fullName.message}
                </p>
              )}
            </div>


            {/* Email Field */}
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Email"
                autoComplete="email"
                className={`w-full p-3 bg-transparent border-b-2 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 input-transparent ${
                  errors.email
                    ? "border-red-500 focus:border-red-400"
                    : "border-gray-600 focus:border-white focus:scale-105"
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-red-400 text-sm animate-fadeIn" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <input
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                className={`w-full p-3 bg-transparent border-b-2 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 input-transparent ${
                  errors.password
                    ? "border-red-500 focus:border-red-400"
                    : "border-gray-600 focus:border-white focus:scale-105"
                }`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    message:
                      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                  },
                })}
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <p className="text-red-400 text-sm animate-fadeIn" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`w-full lg:w-auto bg-white text-black rounded-full font-medium px-8 py-2 transition-all duration-300 ${
                !isValid || isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-90 hover:scale-105 active:scale-95"
              }`}
              aria-label={isLoading ? "Creating account..." : "Create account"}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </div>
      </div>
            <Footer />
      
    </div>
  );
});

Signup.displayName = "Signup";

export default Signup;
