import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
import Loading from "../Components/Sheared/Loading";

const PrivateRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading></Loading>
  }
  return (
    <div>
      {user ? (
        children
      ) : (
        <Navigate state={location.pathname} to="/login"></Navigate>
      )}
    </div>
  );
};

export default PrivateRoutes;
