import React from "react";
import Logo from "../../Components/Logo/Logo";
import { NavLink, Outlet, useNavigation } from "react-router";
import Loading from "../../Components/Sheared/Loading";

const DashboardLayout = () => {
  const navigation = useNavigation();
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* navbar */}
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2 lg:hidden">Dashboard</div>
        </div>
        {/* page content here */}
        <div>
          {navigation.state === "loading" ? (
            <Loading></Loading>
          ) : (
            <Outlet></Outlet>
          )}
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <Logo></Logo>
          <li>
            <NavLink to="/dashboard">My Profile</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/pending-bookings">Pending Bookings</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/bookings-approval">Bookings approval</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/manage-members">Manage Members</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/announcements">Announcements</NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
