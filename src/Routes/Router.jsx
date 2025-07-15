import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home/Home";
import RootLayout from "../Layouts/RootLayout/RootLayout";
import Login from "../Pages/Authentication/Login";
import Register from "../Pages/Authentication/Register";
import Courts from "../Pages/Courts/Courts";

export const router = createBrowserRouter([
    {
        path:"/",
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: Home,
            },
            {
                path:"/courts",
                Component: Courts
            },
            {
                path:"/login",
                Component: Login
            },
            {
                path:"/register",
                Component: Register,
            }
        ]
    }
])