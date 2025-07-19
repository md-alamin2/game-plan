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
          path: "/dashboard/announcements",
          element:<PrivateRoutes><Announcements></Announcements></PrivateRoutes>
        }
    ],
  },
]);
