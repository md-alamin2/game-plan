import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home/Home";
import RootLayout from "../Layouts/RootLayout/RootLayout";
import Login from "../Pages/Authentication/Login";
import Register from "../Pages/Authentication/Register";
import Courts from "../Pages/Courts/Courts";
import DashboardLayout from "../Layouts/DashboardLayout/DashboardLayout";
import MyProfile from "../Pages/Dashboard/MyProfile";
import PrivateRoutes from "./PrivateRoute";
import PendingBookings from "../Pages/Dashboard/PendingBooking";
import Announcements from "../Pages/Dashboard/Announcements";
import BookingsApproval from "../Pages/Dashboard/BookingsApproval";
import ManageMembers from "../Pages/Dashboard/ManageMember";
import AllUsers from "../Pages/Dashboard/AllUsers";
import ManageCourts from "../Pages/Dashboard/ManageCourts/ManageCourts";
import ManageCoupons from "../Pages/Dashboard/ManageCoupons/ManageCoupons";
import ApprovedBookings from "../Pages/Dashboard/ApprovedBookings";
import PaymentPage from "../Pages/Dashboard/Payments/PaymentPage";
import ConfirmedBookings from "../Pages/Dashboard/ConfirmedBookings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/courts",
        Component: Courts,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoutes><DashboardLayout></DashboardLayout></PrivateRoutes>,
    children: [
        {
            index: true,
            element: <PrivateRoutes><MyProfile></MyProfile></PrivateRoutes>
        },
        {
            path:"/dashboard/pending-bookings",
            element: <PrivateRoutes><PendingBookings></PendingBookings></PrivateRoutes>
        },
        {
            path:"/dashboard/approved-bookings",
            element: <PrivateRoutes><ApprovedBookings></ApprovedBookings></PrivateRoutes>
        },
        {
            path:"/dashboard/confirmed-bookings",
            element: <PrivateRoutes><ConfirmedBookings></ConfirmedBookings></PrivateRoutes>
        },
        {
            path:"/dashboard/payment-page/:bookingId",
            element: <PrivateRoutes><PaymentPage></PaymentPage></PrivateRoutes>
        },
        {
            path:"/dashboard/Bookings-approval",
            element: <PrivateRoutes><BookingsApproval></BookingsApproval></PrivateRoutes>
        },
        {
            path:"/dashboard/manage-members",
            element: <PrivateRoutes><ManageMembers></ManageMembers></PrivateRoutes>
        },
        {
            path:"/dashboard/all-users",
            element: <PrivateRoutes><AllUsers></AllUsers></PrivateRoutes>
        },
        {
            path:"/dashboard/manage-courts",
            element: <PrivateRoutes><ManageCourts></ManageCourts></PrivateRoutes>
        },
        {
            path:"/dashboard/manage-coupons",
            element: <PrivateRoutes><ManageCoupons></ManageCoupons></PrivateRoutes>
        },
        {
          path: "/dashboard/announcements",
          element:<PrivateRoutes><Announcements></Announcements></PrivateRoutes>
        }
    ],
  },
]);
