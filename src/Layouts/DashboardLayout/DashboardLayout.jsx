import React from "react";
import Logo from "../../Components/Logo/Logo";
import { NavLink, Outlet, useLocation, useNavigation } from "react-router";
import Loading from "../../Components/Sheared/Loading";

const DashboardLayout = () => {
  const navigation = useNavigation();
  const active = "font-semibold bg-primary text-white";
  const location = useLocation();
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
        <ul className="menu gap-2 bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <Logo></Logo>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive && location.pathname==="/dashboard" ? active : "font-medium")}
            >
              My Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/pending-bookings"
              className={({ isActive }) => (isActive ? active : "font-medium")}
            >
              Pending Bookings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/approved-bookings"
              className={({ isActive }) => (isActive ? active : "font-medium")}
            >
              Approved Bookings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/bookings-approval"
              className={({ isActive }) => (isActive ? active : "font-medium")}
            >
              Bookings approval
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/manage-members"
              className={({ isActive }) => (isActive ? active : "font-medium")}
            >
              Manage Members
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/all-users"
              className={({ isActive }) => (isActive ? active : "font-medium")}
            >
              All Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/manage-courts"
              className={({ isActive }) => (isActive ? active : "font-medium")}
            >
            Manage Courts
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/manage-coupons"
              className={({ isActive }) => (isActive ? active : "font-medium")}
            >
            Manage Coupons
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/announcements"
              className={({ isActive }) => (isActive ? active : "font-medium")}
            >
              Announcements
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
