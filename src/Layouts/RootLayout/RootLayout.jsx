import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Sheared/Navbar";
import { Outlet, useNavigation } from "react-router";
import Footer from "../../Components/Sheared/Footer";
import Loading from "../../Components/Sheared/Loading";
import ScrollToTop from "../../Components/ScrollToTop/ScrollToTop";

const RootLayout = () => {
  const navigation = useNavigation();
  const [loading, setLoading]=useState(true);

  useEffect(()=>{
    setTimeout(()=>{
      1000, setLoading(false)
    })
  },[])
  return (
    <div className="relative">
      <header className="sticky top-0 z-10 backdrop-blur-md shadow-sm">
        <Navbar></Navbar>
      </header>
      <main>
        {navigation.state === "loading" || loading ? (
            <>
              <Loading></Loading>
            </>
          ) : (
            <>
              <ScrollToTop></ScrollToTop>
              <Outlet></Outlet>
            </>
          )}
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
};

export default RootLayout;
