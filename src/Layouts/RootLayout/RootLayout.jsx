import React from "react";
import Navbar from "../../Components/Sheared/Navbar";
import { Outlet } from "react-router";
import Footer from "../../Components/Sheared/Footer";

const RootLayout = () => {
  return (
    <div>
      <header>
        <Navbar></Navbar>
      </header>
      <main>
        <Outlet></Outlet>
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
};

export default RootLayout;
