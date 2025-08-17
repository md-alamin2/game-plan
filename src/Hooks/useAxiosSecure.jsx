import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useEffect } from "react";

const axiosSecure = axios.create({
  baseURL: "https://assignment-12-server-gray-six.vercel.app/",
  // baseURL: "http://localhost:3000/",
});

const useAxiosSecure = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.accessToken) {
      // Add request interceptor
      const requestInterceptor = axiosSecure.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      // Add response interceptor
      const responseInterceptor = axiosSecure.interceptors.response.use(
        (res) => res,
        (error) => {
          const status = error.status;
          if (status === 403) {
            navigate("/forbidden");
          } else if (status === 401) {
            logout()
              .then(() => {
                Swal.fire({
                  title: "Log out",
                  text: `${status} Unauthorized Access`,
                  icon: "success",
                });
                navigate("/login");
              })
              .catch(() => {});
          }
          return Promise.reject(error);
        }
      );

      // Cleanup to prevent multiple interceptors on re-renders
      return () => {
        axiosSecure.interceptors.request.eject(requestInterceptor);
        axiosSecure.interceptors.response.eject(responseInterceptor);
      };
    }
  }, [user, loading, logout, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
