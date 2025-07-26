import { useQuery } from "@tanstack/react-query";
import React from "react";
import useUserRole from "./useUserRole";
import Loading from "../Components/Sheared/Loading";
import useAxiosSecure from "./useAxiosSecure";

const useAdminState = () => {
  const axiosSecure = useAxiosSecure();
  const { role, roleLoading } = useUserRole();

  const { data: courtState, isLoading } = useQuery({
    queryKey: ["courts"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("courts");
      return data;
    },
    enabled: role === "admin",
  });

  const { data: usersState, isLoading: userLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axiosSecure.get("users");
      return data;
    },
    enabled: role === "admin",
  });

  const { data: membersState, isLoading: memberLoading } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data } = await axiosSecure.get("members");
      return data;
    },
    enabled: role === "admin",
  });

  roleLoading && <Loading></Loading>

  const adminStatus = {
    courtState,
    isLoading,
    usersState,
    userLoading,
    membersState,
    memberLoading,
  };
  return adminStatus;
};

export default useAdminState;
