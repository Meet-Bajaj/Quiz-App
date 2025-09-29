// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useLocation, useNavigate, Link } from "react-router-dom";
// import Prism from "../components/Prism";
// import Footer from "../components/Footer";
// import Navbar from "../components/NavAuth";

// const SelectRole = React.memo(() => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { userData } = location.state || {};
//   const [isLoading, setIsLoading] = useState(false);

//   const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm({
//     mode: "onChange",
//     defaultValues: {
//       role: "",
//       organizationName: "",
//       organization_Id: "",
//       preferredCategories: "",
//       experienceLevel: "",
//     },
//   });

//   const role = watch("role");

//   // useEffect(() => {
//     // if (!userData) {
//       // Redirect back if missing previous step data
//       // navigate("/signup");
//     // }
//   // }, [userData, navigate]);

//   const onSubmit = async (data) => {
//     setIsLoading(true);
//     try {
//       const finalData = { ...userData, ...data };
//       console.log("Final Signup Data:", finalData);
//       // Send 'finalData' to backend or complete signup flow
//       alert("Sign Up Complete!");
//       navigate("/login");
//     } catch (error) {
//       console.error("Role selection error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const attributes = {
//     animationType: "rotate",
//     timeScale: 0.5,
//     height: 3.5,
//     baseWidth: 5.5,
//     scale: 3.6,
//     hueShift: 0,
//     colorFrequency: 1,
//     noise: 0,
//     glow: 1,
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center h-screen w-screen p-4 bg-black/20 backdrop-blur-sm">
//       <Navbar isRequired={false} />
//       <div className="w-full h-full absolute -z-10 opacity-50 md:flex hidden">
//         <Prism {...attributes} />
//       </div>
//       <div className="flex flex-col lg:flex-row justify-between items-center w-full max-w-6xl rounded-xl shadow-2xl bg-zinc-950 min-h-[500px] overflow-hidden">
//         {/* Left Section - Welcome Message */}
//         <div className="flex-1 p-8 lg:p-12 text-center lg:text-left w-full border-b lg:border-b-0 lg:border-r border-gray-800">
//           <h2 className="text-4xl lg:text-7xl bricolage font-bold text-white mb-4">
//             Choose Role
//           </h2>
//           <Link
//             to="/signup"
//             className="inline-block group"
//             aria-label="Go back to signup"
//           >
//             <p className="text-white text-sm lg:text-base pt-sans">
//               Want to go back?{" "}
//               <span className="text-blue-400 hover:text-blue-300 group-hover:underline transition-colors">
//                 Previous Step
//               </span>
//             </p>
//           </Link>
//           <p className="text-gray-400 mt-6">
//             Select your role to customize your experience on our quiz platform!
//           </p>
//         </div>

//         {/* Right Section - Form */}
//         <div className="flex-1 p-8 lg:p-12 w-full">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* Role Selection */}
//             <div className="space-y-4">
//               <h3 className="text-white text-lg font-medium mb-4">Select Your Role</h3>
//               <div className="flex flex-col space-y-3">
//                 <label className="flex items-center space-x-3 cursor-pointer group">
//                   <input
//                     type="radio"
//                     value="Host"
//                     {...register("role", { required: "Please select a role" })}
//                     className="w-4 h-4 text-blue-600 bg-transparent border-2 border-gray-600 focus:ring-blue-500 focus:ring-2"
//                   />
//                   <span className="text-white group-hover:text-blue-300 transition-colors">
//                     Host - Create and manage quizzes
//                   </span>
//                 </label>
//                 <label className="flex items-center space-x-3 cursor-pointer group">
//                   <input
//                     type="radio"
//                     value="Participant"
//                     {...register("role", { required: "Please select a role" })}
//                     className="w-4 h-4 text-blue-600 bg-transparent border-2 border-gray-600 focus:ring-blue-500 focus:ring-2"
//                   />
//                   <span className="text-white group-hover:text-blue-300 transition-colors">
//                     Participant - Take quizzes and compete
//                   </span>
//                 </label>
//               </div>
//               {errors.role && (
//                 <p className="text-red-400 text-sm animate-fadeIn" role="alert">
//                   {errors.role.message}
//                 </p>
//               )}
//             </div>

//             {/* Host Fields */}
//             {role === "Host" && (
//               <div className="space-y-6 animate-fadeIn">
//                 <div className="space-y-2">
//                   <input
//                     type="text"
//                     placeholder="Organization Name"
//                     className={`w-full p-3 bg-transparent border-b-2 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 input-transparent rounded-sm ${
//                       errors.organizationName
//                         ? "border-red-500 focus:border-red-400"
//                         : "border-gray-600 focus:border-white focus:scale-105"
//                     }`}
//                     {...register("organizationName", {
//                       required: "Organization Name is required",
//                       minLength: {
//                         value: 2,
//                         message: "Organization Name must be at least 2 characters",
//                       },
//                     })}
//                     aria-invalid={errors.organizationName ? "true" : "false"}
//                   />
//                   {errors.organizationName && (
//                     <p className="text-red-400 text-sm animate-fadeIn" role="alert">
//                       {errors.organizationName.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <input
//                     type="number"
//                     placeholder="Organization ID"
//                     min="1"
//                     className={`w-full p-3 bg-transparent border-b-2 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 input-transparent rounded-sm ${
//                       errors.organization_Id
//                         ? "border-red-500 focus:border-red-400"
//                         : "border-gray-600 focus:border-white focus:scale-105"
//                     }`}
//                     {...register("organization_Id", {
//                       required: "Number of Quizzes is required",
//                       min: {
//                         value: 1,
//                         message: "Must be at least 1 quiz",
//                       },
//                     })}
//                     aria-invalid={errors.organization_Id ? "true" : "false"}
//                   />
//                   {errors.organization_Id && (
//                     <p className="text-red-400 text-sm animate-fadeIn" role="alert">
//                       {errors.organization_Id.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Participant Fields */}
//             {role === "Participant" && (
//               <div className="space-y-6 animate-fadeIn">
//                 <div className="space-y-2">
//                   <select
//                     className={`w-full p-3 bg-transparent border-b-2 text-white focus:outline-none transition-all duration-300 rounded-sm ${
//                       errors.preferredCategories
//                         ? "border-red-500 focus:border-red-400"
//                         : "border-gray-600 focus:border-white focus:scale-105"
//                     }`}
//                     {...register("preferredCategories", { required: "Please select a category" })}
//                     aria-invalid={errors.preferredCategories ? "true" : "false"}
//                   >
//                     <option value="" className="bg-zinc-950 text-gray-400">Select Preferred Category</option>
//                     <option value="Science" className="bg-zinc-950 text-white">Science</option>
//                     <option value="History" className="bg-zinc-950 text-white">History</option>
//                     <option value="Math" className="bg-zinc-950 text-white">Mathematics</option>
//                     <option value="Technology" className="bg-zinc-950 text-white">Technology</option>
//                     <option value="Sports" className="bg-zinc-950 text-white">Sports</option>
//                     <option value="General" className="bg-zinc-950 text-white">General Knowledge</option>
//                   </select>
//                   {errors.preferredCategories && (
//                     <p className="text-red-400 text-sm animate-fadeIn" role="alert">
//                       {errors.preferredCategories.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <select
//                     className={`w-full p-3 bg-transparent border-b-2 text-white focus:outline-none transition-all duration-300 rounded-sm ${
//                       errors.experienceLevel
//                         ? "border-red-500 focus:border-red-400"
//                         : "border-gray-600 focus:border-white focus:scale-105"
//                     }`}
//                     {...register("experienceLevel", { required: "Please select experience level" })}
//                     aria-invalid={errors.experienceLevel ? "true" : "false"}
//                   >
//                     <option value="" className="bg-zinc-950 text-gray-400">Select Experience Level</option>
//                     <option value="Beginner" className="bg-zinc-950 text-white">Beginner</option>
//                     <option value="Intermediate" className="bg-zinc-950 text-white">Intermediate</option>
//                     <option value="Advanced" className="bg-zinc-950 text-white">Advanced</option>
//                   </select>
//                   {errors.experienceLevel && (
//                     <p className="text-red-400 text-sm animate-fadeIn" role="alert">
//                       {errors.experienceLevel.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={!isValid || isLoading}
//               className={`w-full lg:w-auto bg-white text-black rounded-full font-medium px-8 py-2 transition-all duration-300 ${
//                 !isValid || isLoading
//                   ? "opacity-50 cursor-not-allowed"
//                   : "hover:opacity-90 hover:scale-105 active:scale-95"
//               }`}
//               aria-label={isLoading ? "Completing signup..." : "Complete signup"}
//             >
//               {isLoading ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
//                   Completing Sign Up...
//                 </div>
//               ) : (
//                 "Complete Sign Up"
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// });

// SelectRole.displayName = "SelectRole";

// export default SelectRole;



import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Prism from "../components/Prism";
import Footer from "../components/Footer";
import Navbar from "../components/NavAuth";

const SelectRole = React.memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      role: "",
      organizationName: "",
      program: "",
      organizationId: "",
    },
  });

  const role = watch("role");

  // Dynamic data loading
  useEffect(() => {
    const loadDynamicData = async () => {
      setLoadingData(true);
      try {
        // Replace with actual API calls
        const orgsData = [
          { id: 1, name: "Acme University" },
          { id: 2, name: "Tech Institute" },
          { id: 3, name: "Global High School" },
          { id: 4, name: "Open Learning Center" },
        ];
        
        const programsData = [
          { id: 1, name: "B.Tech", code: "BTECH" },
          { id: 2, name: "BCA", code: "BCA" },
          { id: 3, name: "BBA", code: "BBA" },
          { id: 4, name: "B.A.", code: "BA" },
        ];

        setOrganizations(orgsData);
        setPrograms(programsData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadDynamicData();
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const finalData = { ...userData, ...data };
      console.log("Final Signup Data:", finalData);
      
      // Replace with actual API call
      // await signupAPI(finalData);
      
      alert("Sign Up Complete!");
      navigate("/login");
    } catch (error) {
      console.error("Role selection error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
    <div className="fixed inset-0 flex items-center justify-center h-screen w-screen p-4 bg-black/20 backdrop-blur-sm">
      <Navbar isRequired={false} />
      <div className="w-full h-full absolute -z-10 opacity-50 md:flex hidden">
        <Prism {...attributes} />
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-center w-full max-w-6xl rounded-xl shadow-2xl bg-zinc-950 min-h-[500px] overflow-hidden">
        {/* Left Section - Welcome Message */}
        <div className="flex-1 p-8 lg:p-12 text-center lg:text-left w-full border-b lg:border-b-0 lg:border-r border-gray-800">
          <h2 className="text-4xl lg:text-7xl bricolage font-bold text-white mb-4">
            Choose Role
          </h2>
          <Link
            to="/signup"
            className="inline-block group"
            aria-label="Go back to signup"
          >
            <p className="text-white text-sm lg:text-base pt-sans">
              Want to go back?{" "}
              <span className="text-blue-400 hover:text-blue-300 group-hover:underline transition-colors">
                Previous Step
              </span>
            </p>
          </Link>
          <p className="text-gray-400 mt-6">
            Select your role to customize your experience on our quiz platform!
          </p>
        </div>

        {/* Right Section - Form */}
        <div className="flex-1 p-8 lg:p-12 w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-medium mb-4">
                Select Your Role
              </h3>
              <div className="flex flex-col space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="radio"
                    value="Host"
                    {...register("role", { required: "Please select a role" })}
                    className="w-4 h-4 text-blue-600 bg-transparent border-2 border-gray-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-white group-hover:text-blue-300 transition-colors">
                    Host - Create and manage quizzes
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="radio"
                    value="Participant"
                    {...register("role", { required: "Please select a role" })}
                    className="w-4 h-4 text-blue-600 bg-transparent border-2 border-gray-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-white group-hover:text-blue-300 transition-colors">
                    Participant - Take quizzes and compete
                  </span>
                </label>
              </div>
              {errors.role && (
                <p className="text-red-400 text-sm animate-fadeIn" role="alert">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Host Fields */}
            {role === "Host" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Organization Name"
                    className={`w-full p-3 bg-transparent border-b-2 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 rounded-sm ${
                      errors.organizationName
                        ? "border-red-500 focus:border-red-400"
                        : "border-gray-600 focus:border-white focus:scale-105"
                    }`}
                    {...register("organizationName", {
                      required: "Organization Name is required",
                      minLength: {
                        value: 2,
                        message: "Organization Name must be at least 2 characters",
                      },
                    })}
                    aria-invalid={errors.organizationName ? "true" : "false"}
                  />
                  {errors.organizationName && (
                    <p className="text-red-400 text-sm animate-fadeIn" role="alert">
                      {errors.organizationName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Organization ID"
                    className={`w-full p-3 bg-transparent border-b-2 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 rounded-sm ${
                      errors.organizationId
                        ? "border-red-500 focus:border-red-400"
                        : "border-gray-600 focus:border-white focus:scale-105"
                    }`}
                    {...register("organizationId", {
                      required: "Organization ID is required",
                      minLength: {
                        value: 1,
                        message: "Organization ID cannot be empty",
                      },
                    })}
                    aria-invalid={errors.organizationId ? "true" : "false"}
                  />
                  {errors.organizationId && (
                    <p className="text-red-400 text-sm animate-fadeIn" role="alert">
                      {errors.organizationId.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Participant Fields */}
            {role === "Participant" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Select Organization Name */}
                <div className="space-y-2">
                  <select
                    className={`w-full p-3 bg-transparent border-b-2 text-white focus:outline-none transition-all duration-300 rounded-sm ${
                      errors.organizationName
                        ? "border-red-500 focus:border-red-400"
                        : "border-gray-600 focus:border-white focus:scale-105"
                    }`}
                    {...register("organizationName", {
                      required: "Please select an organization",
                    })}
                    aria-invalid={errors.organizationName ? "true" : "false"}
                    disabled={loadingData}
                  >
                    <option value="" className="bg-zinc-950 text-gray-400">
                      {loadingData ? "Loading organizations..." : "Select Organization"}
                    </option>
                    {organizations.map((org) => (
                      <option
                        key={org.id}
                        value={org.name}
                        className="bg-zinc-950 text-white"
                      >
                        {org.name}
                      </option>
                    ))}
                  </select>
                  {errors.organizationName && (
                    <p className="text-red-400 text-sm animate-fadeIn" role="alert">
                      {errors.organizationName.message}
                    </p>
                  )}
                </div>

                {/* Select Program - Fixed field name conflict */}
                <div className="space-y-2">
                  <select
                    className={`w-full p-3 bg-transparent border-b-2 text-white focus:outline-none transition-all duration-300 rounded-sm ${
                      errors.program
                        ? "border-red-500 focus:border-red-400"
                        : "border-gray-600 focus:border-white focus:scale-105"
                    }`}
                    {...register("program", {
                      required: "Please select a program",
                    })}
                    aria-invalid={errors.program ? "true" : "false"}
                    disabled={loadingData}
                  >
                    <option value="" className="bg-zinc-950 text-gray-400">
                      {loadingData ? "Loading programs..." : "Select Program"}
                    </option>
                    {programs.map((program) => (
                      <option
                        key={program.id}
                        value={program.code}
                        className="bg-zinc-950 text-white"
                      >
                        {program.name}
                      </option>
                    ))}
                  </select>
                  {errors.program && (
                    <p className="text-red-400 text-sm animate-fadeIn" role="alert">
                      {errors.program.message}
                    </p>
                  )}
                </div>

                {/* Organization ID Input - Fixed field name */}
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Organization ID (e.g., Roll No.)"
                    className={`w-full p-3 bg-transparent border-b-2 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 rounded-sm ${
                      errors.organizationId
                        ? "border-red-500 focus:border-red-400"
                        : "border-gray-600 focus:border-white focus:scale-105"
                    }`}
                    {...register("organizationId", {
                      required: "Organization ID is required",
                      minLength: {
                        value: 1,
                        message: "Organization ID cannot be empty",
                      },
                      pattern: {
                        value: /^[A-Za-z0-9]+$/,
                        message: "Organization ID can only contain letters and numbers",
                      },
                    })}
                    aria-invalid={errors.organizationId ? "true" : "false"}
                  />
                  {errors.organizationId && (
                    <p className="text-red-400 text-sm animate-fadeIn" role="alert">
                      {errors.organizationId.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid || isLoading || loadingData}
              className={`w-full lg:w-auto bg-white text-black rounded-full font-medium px-8 py-2 transition-all duration-300 ${
                !isValid || isLoading || loadingData
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-90 hover:scale-105 active:scale-95"
              }`}
              aria-label={isLoading ? "Completing signup..." : "Complete signup"}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Completing Sign Up...
                </div>
              ) : (
                "Complete Sign Up"
              )}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
});

SelectRole.displayName = "SelectRole";

export default SelectRole;
