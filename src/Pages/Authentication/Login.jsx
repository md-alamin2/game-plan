import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../Hooks/useAuth";
import GoogleLogin from "./GoogleLogin";
import useAxios from "../../Hooks/useAxios";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { setUser, loginUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosInstance = useAxios();

  const onSubmit = (data) => {
    // login user
    loginUser(data.email, data.password)
      .then(async (result) => {
        const user = result.user;
        // set user on db
        const userInfo = {
          email: user.email,
          last_login: new Date().toISOString(),
        };

        const userRes = await axiosInstance.post("users", userInfo);

        if (userRes.data.modifiedCount) {
          Swal.fire({
            title: "Login!",
            text: "User login successfully!",
            icon: "success",
            timer: 2000,
          });
          setUser(user);
          navigate(`${location.state ? location.state : "/"}`);
        }
      })
      .catch((error) => {
        const errorMassage = error.code;
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
  };

  // Password validation rules
  const passwordValidation = {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters",
    },
    validate: {
      hasUpperCase: (value) =>
        /[A-Z]/.test(value) || "Must contain at least one uppercase letter",
      hasLowerCase: (value) =>
        /[a-z]/.test(value) || "Must contain at least one lowercase letter",
    },
  };

  return (
    <div className="flex justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 border border-gray-300 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md space-y-4">
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
                autoComplete="current-password"
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

          {/* remember me */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 border rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary">
                Forgot your password?
              </Link>
            </div>
          </div>
          {/* submit button */}
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
                "Sign in"
              )}
            </button>
          </div>
        </form>

        {/* Google login */}
        <GoogleLogin loading={loading} />
        <div className="text-center text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/register" className="font-medium text-primary">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
