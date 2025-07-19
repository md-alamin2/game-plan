import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure.jsx";


const useUserRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure(); 

  const { data: role, isLoading, refetch } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `users/role?email=${user.email}`
      );
      return res.data.role;
    },
  });

  return { role, roleLoading: loading || isLoading, refetch };
};

export default useUserRole;