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
import PaymentHistory from "../Pages/Dashboard/PaymentHistory";
import ManageConfirmedBookings from "../Pages/Dashboard/ManageConfirmedBookings";
import AdminRoute from "./AdminRoute";
import ForbiddenPage from "../Components/Sheared/ForbiddenPage";
import ErrorPage from "../Components/Sheared/ErrorPage";

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
    errorElement:<ErrorPage></ErrorPage>
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
            path:"/dashboard/payment-history",
            element: <PrivateRoutes><PaymentHistory></PaymentHistory></PrivateRoutes>
        },
        {
            path:"/dashboard/payment-page/:bookingId",
            element: <PrivateRoutes><PaymentPage></PaymentPage></PrivateRoutes>
        },
        {
            path:"/dashboard/Bookings-approval",
            element: <AdminRoute><BookingsApproval></BookingsApproval></AdminRoute>
        },
        {
            path:"/dashboard/manage-members",
            element: <AdminRoute><ManageMembers></ManageMembers></AdminRoute>
        },
        {
            path:"/dashboard/all-users",
            element: <AdminRoute><AllUsers></AllUsers></AdminRoute>
        },
        {
            path:"/dashboard/manage-courts",
            element: <AdminRoute><ManageCourts></ManageCourts></AdminRoute>
        },
        {
            path:"/dashboard/manage-coupons",
            element: <AdminRoute><ManageCoupons></ManageCoupons></AdminRoute>
        },
        {
            path:"/dashboard/manage-confirmed-bookings",
            element: <AdminRoute><ManageConfirmedBookings></ManageConfirmedBookings></AdminRoute>
        },
        {
          path: "/dashboard/announcements",
          element:<PrivateRoutes><Announcements></Announcements></PrivateRoutes>
        }
    ],
    errorElement:<ErrorPage></ErrorPage>
  },
  {
    path:"/forbidden",
    Component: ForbiddenPage
  },
  
]);
