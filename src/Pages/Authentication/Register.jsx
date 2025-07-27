import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../Hooks/useAuth";
import { FaUpload } from "react-icons/fa";
import useAxios from "../../Hooks/useAxios";
import axios from "axios";
import GoogleLogin from "./GoogleLogin";

const Register = () => {
  const [previewURL, setPreviewURL] = useState(null);
  const { createUser, updateUser, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const axiosInstance = useAxios();

  const onSubmit = async (info) => {
    setLoading(true);
    const { name, email, password } = info;
    const image = info.photo[0];
    const imgFormData = new FormData();
    imgFormData.append("image", image);
    const { data } = await axios.post(
      `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMGBB_API_KEY
      }`,
      imgFormData
    );
    const imgUrl = data.data.display_url;
    if (imgUrl) {
      // create user
      createUser(email, password)
        .then(async (result) => {
          const user = result.user;
          // set user on db
          const userInfo = {
            email: user.email,
            name,
            image: imgUrl,
            role: "user",
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
          };

          const userRes = await axiosInstance.post("users", userInfo);

          if (userRes.data.insertedId) {
            updateUser({ displayName: name, photoURL: imgUrl })
              .then(() => {
                // set user
                setUser({
                  ...user,
                  displayName: name,
                  photoURL: imgUrl,
                });
                setLoading(false);
                Swal.fire({
                  title: "Login!",
                  text: "User login successfully!",
                  icon: "success",
                  timer: 2000,
                });
                navigate(`${location.state ? location.state : "/"}`);
              })
              .catch((error) => {
                const errorMassage = error.code;
                setUser(user);
                setLoading(false);
                toast.error(`${errorMassage}`, {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
              });
          }
        })
        .catch((error) => {
          const errorMassage = error.code;
          setLoading(false);
          toast.error(`${errorMassage}`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif"];

    if (!validTypes.includes(file.type)) {
      Swal.fire("Invalid Format", "Only JPG, PNG, or GIF allowed", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire("Too Large", "File must be less than 2MB", "error");
      return;
    }

    setPreviewURL(URL.createObjectURL(file));
  };

  // Password validation rules
  const passwordValidation = {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters"
    },
    validate: {
      hasUpperCase: value => 
        /[A-Z]/.test(value) || "Must contain at least one uppercase letter",
      hasLowerCase: value => 
        /[a-z]/.test(value) || "Must contain at least one lowercase letter"
    }
  };

  return (
    <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <title>Register</title>
      <div className="max-w-md w-full space-y-8 bg-white p-8 border border-gray-300 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-sm text-gray-600">Join our community today</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md space-y-4">
            {/* image */}
            <label
              htmlFor="fileInput"
              className="w-full h-32 border border-dashed border-gray-300 bg-gray-50 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-500 transition py-5"
            >
              {previewURL ? (
                <img
                  src={previewURL}
                  alt="Preview"
                  className="h-full object-contain rounded"
                />
              ) : (
                <>
                  <FaUpload className="text-2xl mb-2 text-gray-500" />
                  <p className="font-semibold text-gray-700">Upload picture</p>
                  <p className="text-sm text-gray-500">
                    Choose photo size &lt;{" "}
                    <span className="font-semibold">2mb</span>
                    <br />
                    Format:{" "}
                    <span className="font-semibold">JPG, PNG, or GIF</span>
                  </p>
                </>
              )}

              <input
                type="file"
                id="fileInput"
                {...register("photo", { required: true })}
                accept="image/png, image/jpeg, image/gif"
                onChange={handleFileChange}
                // className="hidden"
              />
            </label>
            {errors.photo?.type === "required" && (
              <p role="alert" className="text-red-500">
                Photo is required
              </p>
            )}
            {/* name */}
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                })}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                placeholder="Full Name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
            {/* email */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* password */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password", passwordValidation)}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                placeholder="Password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              {...register("terms", {
                required: "You must accept the terms and conditions",
              })}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{" "}
              <Link to="/terms" className="text-primary">
                Terms and Conditions
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p className="text-sm text-red-600">{errors.terms.message}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary w-full text-white ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>

        {/* Google login */}
        <GoogleLogin/>

        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="font-medium text-primary">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
