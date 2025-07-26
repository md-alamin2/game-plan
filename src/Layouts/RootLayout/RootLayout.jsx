import React from "react";
import Navbar from "../../Components/Sheared/Navbar";
import { Outlet } from "react-router";
import Footer from "../../Components/Sheared/Footer";

const RootLayout = () => {
  return (
    <div className="relative">
      <header className="sticky top-0 z-10 backdrop-blur-md shadow-sm">
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
