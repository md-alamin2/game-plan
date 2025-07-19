import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3000/",
});

const useAxiosSecure = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  axiosSecure.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosSecure.interceptors.response.use(
    (res) => {
      return res;
    },
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
  return axiosSecure;
};

export default useAxiosSecure;
