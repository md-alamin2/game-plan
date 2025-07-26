import React from "react";
import useAuth from "../Hooks/useAuth";
import { ClipLoader } from "react-spinners";
import useUserRole from "../Hooks/useUserRole";
import { Navigate} from "react-router";
import Loading from "../Components/Sheared/Loading";

const MemberRoute = ({children}) => {
  const { user, loading } = useAuth();
  const {role, roleLoading} = useUserRole();

  if (loading || roleLoading) {
    return <Loading></Loading>
  }

  if(!user || role !== "member" && role !=="admin"){
    return <Navigate to="/forbidden"></Navigate>
  }
  return children;
};

export default MemberRoute;