import React from "react";
import Logo from "../Logo/Logo";
import { Link, NavLink } from "react-router";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { MdOutlineLogout } from "react-icons/md";

const Navbar = () => {
  const { logoutUser, user } = useAuth();
  const active = "font-semibold bg-primary text-white";
  const links = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? active : "font-medium")}
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/courts"
          className={({ isActive }) => (isActive ? active : "font-medium")}
        >
          Courts
        </NavLink>
      </li>
    </>
  );

  // logout
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        logoutUser()
          .then(() => {
            Swal.fire({
              title: "Logout!",
              text: "User logout successfully",
              icon: "success",
            });
          })
          .catch((error) => {
            const errorMessage = error.code;
            toast.error(`Login failed ${errorMessage}`, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          });
      }
    });
  };
  return (
    <div>
      <div className="navbar w-11/12 lg:container mx-auto py-5">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {links}
            </ul>
          </div>
          <Logo></Logo>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{links}</ul>
        </div>
        <div className="navbar-end">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="dropdown dropdown-hover dropdown-end lg:dropdown-start">
                <img
                  tabIndex={0}
                  className="h-14 w-14 rounded-full ring-2 ring-primary cursor-pointer"
                  src={`${user.photoURL}`}
                  alt="user"
                />
                <ul
                  tabIndex={0}
                  className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                >
                  <li>
                    <p>{user.displayName}</p>
                  </li>
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <button
                      className="text-red-500 flex items-center"
                      onClick={handleLogout}
                    >
                      Logout <MdOutlineLogout size={20} />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn btn-primary text-black">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
