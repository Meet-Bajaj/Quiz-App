import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Prism from "../components/Prism";
import Footer from "../components/Footer";
import Navbar from "../components/NavAuth";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [organizations, setOrganizations] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // API base URL
  const API_BASE_URL = "http://localhost:5000/api/";

  // Step 1: User Details Form Setup
  const {
    register: registerUser,
    handleSubmit: handleSubmitUser,
    formState: { errors: errorsUser, isValid: isValidUser },
    watch: watchUser,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Step 2: Role + Organization Form Setup
  const {
    register: registerRole,
    handleSubmit: handleSubmitRole,
    formState: { errors: errorsRole, isValid: isValidRole },
    watch: watchRole,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      role: "",
      organizationName: "",
      organizationCode: "",
    },
  });

  const watchedRole = watchRole("role");

  // Fetch organizations from API on step 2 entry
  useEffect(() => {
    if (step === 2) {
      setLoadingData(true);
      axios.get(`${API_BASE_URL}auth/organizations`)
        .then((res) => {
          setOrganizations(res.data);
          setLoadingData(false);
        })
        .catch(() => {
          setError("Failed to load organizations");
          setLoadingData(false);
        });
    }
  }, [step]);

  // Clear error/success whenever step changes
  useEffect(() => {
    setError("");
    setSuccess("");
  }, [step]);

  // Step 1 Next
  const handleUserDetailsNext = (data) => {
    setUserDetails(data);
    setStep(2);
    window.scrollTo(0, 0);
  };

  // Final signup submit
  const handleFinalSubmit = async (roleData) => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const signupData = {
        ...userDetails,
        role: roleData.role,
        organizationName: roleData.organizationName,
        organizationCode: roleData.organizationCode,
      };
      const response = await axios.post(
        `${API_BASE_URL}auth/signup`,
        signupData,
        { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
      );
      if (response.status === 200 || response.status === 201) {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
                           err.response?.data?.error ||
                           "Signup failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Prism attributes
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

  // Password strength indicator
  const password = watchUser("password", "");
  const getPasswordStrength = (pass) => {
    if (!pass) return { strength: 0, text: "", color: "gray" };
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[@$!%*?&]/.test(pass)) strength++;
    const levels = [
      { text: "Very Weak", color: "red" },
      { text: "Weak", color: "orange" },
      { text: "Fair", color: "yellow" },
      { text: "Good", color: "lightgreen" },
      { text: "Strong", color: "green" }
    ];
    return levels[Math.min(strength, 4)];
  };
  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <Navbar isRequired={false} />
      <div className="w-full h-full fixed top-0 left-0 -z-10 opacity-50">
        <Prism {...attributes} />
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-center w-full max-w-4xl rounded-2xl shadow-2xl bg-zinc-950 overflow-hidden mt-16">
        {/* Left Section */}
        <div className="flex-1 p-8 lg:p-12 text-center lg:text-left w-full border-b lg:border-b-0 lg:border-r border-gray-800">
          <div className="flex items-center justify-center lg:justify-start mb-6">
            <div className="flex space-x-2">
              {[1, 2].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    step === stepNumber ? "bg-white scale-110" : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {step === 1 ? "Create Account" : "Organization Details"}
          </h2>
          {step === 1 ? (
            <Link to="/login" className="inline-block group mt-4" aria-label="Navigate to login page">
              <p className="text-white text-base pt-sans">
                Already have an account?{" "}
                <span className="text-blue-400 hover:text-blue-300 group-hover:underline transition-colors duration-200">
                  Log In
                </span>
              </p>
            </Link>
          ) : (
            <button
              onClick={() => setStep(1)}
              className="inline-block group mt-4 text-left"
              aria-label="Go back to previous step"
            >
              <p className="text-white text-base pt-sans">
                Want to go back?{" "}
                <span className="text-blue-400 hover:text-blue-300 group-hover:underline transition-colors duration-200">
                  Previous Step
                </span>
              </p>
            </button>
          )}
          <p className="text-gray-400 mt-6 text-lg leading-relaxed">
            {step === 1
              ? "Join us today and start your journey with our quiz platform!"
              : "Select your organization and provide your organization ID."}
          </p>
        </div>

        {/* Right Section - Forms */}
        <div className="flex-1 p-8 lg:p-12 w-full max-w-md mx-auto">
          {/* Error and Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg animate-fadeIn">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg animate-fadeIn">
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}
          {step === 1 && (
            <form onSubmit={handleSubmitUser(handleUserDetailsNext)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className={`w-full p-4 bg-zinc-900/50 border-2 text-white placeholder-gray-400 rounded-lg ${
                    errorsUser.name
                      ? "border-red-500"
                      : "border-zinc-700 focus:border-blue-500"
                  }`}
                  {...registerUser("name", {
                    required: "Full Name is required",
                    minLength: { value: 2, message: "Name must be at least 2 characters" },
                    maxLength: { value: 50, message: "Name must be less than 50 characters" },
                  })}
                  aria-invalid={errorsUser.name ? "true" : "false"}
                />
                {errorsUser.name && <p className="text-red-400 text-sm">{errorsUser.name.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  autoComplete="email"
                  className={`w-full p-4 bg-zinc-900/50 border-2 text-white placeholder-gray-400 rounded-lg ${
                    errorsUser.email
                      ? "border-red-500"
                      : "border-zinc-700 focus:border-blue-500"
                  }`}
                  {...registerUser("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                  aria-invalid={errorsUser.email ? "true" : "false"}
                />
                {errorsUser.email && <p className="text-red-400 text-sm">{errorsUser.email.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Password</label>
                <input
                  type="password"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  className={`w-full p-4 bg-zinc-900/50 border-2 text-white placeholder-gray-400 rounded-lg ${
                    errorsUser.password
                      ? "border-red-500"
                      : "border-zinc-700 focus:border-blue-500"
                  }`}
                  {...registerUser("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                      message:
                        "Must include uppercase, lowercase, number, and special character",
                    },
                  })}
                  aria-invalid={errorsUser.password ? "true" : "false"}
                />
                {password && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Password strength:</span>
                      <span className={`text-${passwordStrength.color}-400`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-${passwordStrength.color}-500`}
                        style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                {errorsUser.password && <p className="text-red-400 text-sm">{errorsUser.password.message}</p>}
              </div>
              <button
                type="submit"
                disabled={!isValidUser || isLoading}
                className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold px-8 py-4 transition-all duration-300 ${
                  !isValidUser || isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-90 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                }`}
                aria-label="Next: Choose Organization"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  "Continue to Organization"
                )}
              </button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleSubmitRole(handleFinalSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Select Role</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="host"
                      {...registerRole("role", { required: "Please select a role" })}
                      className="accent-blue-500"
                    />
                    <span className="text-white">Host</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="participant"
                      {...registerRole("role", { required: "Please select a role" })}
                      className="accent-blue-500"
                    />
                    <span className="text-white">Participant</span>
                  </label>
                </div>
                {errorsRole.role && <p className="text-red-400 text-sm">{errorsRole.role.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Organization</label>
                <select
                  className={`w-full p-4 bg-zinc-900/50 border-2 text-white rounded-lg ${
                    errorsRole.organizationName
                      ? "border-red-500"
                      : "border-zinc-700 focus:border-blue-500"
                  }`}
                  {...registerRole("organizationName", {
                    required: "Please select an organization",
                  })}
                  aria-invalid={errorsRole.organizationName ? "true" : "false"}
                  disabled={loadingData}
                >
                  <option value="">
                    {loadingData ? "Loading organizations..." : "Select your organization"}
                  </option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.name}>
                      {org.name} ({org.code})
                    </option>
                  ))}
                </select>
                {errorsRole.organizationName && <p className="text-red-400 text-sm">{errorsRole.organizationName.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Organization ID</label>
                <input
                  type="text"
                  placeholder="Enter your organization ID"
                  className={`w-full p-4 bg-zinc-900/50 border-2 text-white rounded-lg ${
                    errorsRole.organizationCode
                      ? "border-red-500"
                      : "border-zinc-700 focus:border-blue-500"
                  }`}
                  {...registerRole("organizationCode", {
                    required: "Organization ID is required",
                    pattern: {
                      value: /^[A-Za-z0-9]+$/,
                      message: "Organization ID can only contain letters and numbers",
                    },
                  })}
                  aria-invalid={errorsRole.organizationCode ? "true" : "false"}
                />
                {errorsRole.organizationCode && <p className="text-red-400 text-sm">{errorsRole.organizationCode.message}</p>}
              </div>
              <button
                type="submit"
                disabled={!isValidRole || isLoading || loadingData}
                className={`w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold px-8 py-4 transition-all duration-300 ${
                  !isValidRole || isLoading || loadingData
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-90 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                }`}
                aria-label={isLoading ? "Creating your account..." : "Create Account"}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
