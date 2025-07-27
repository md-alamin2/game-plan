import React from "react";
import logo from "../../assets/GamePlane_logo.png";
import { Link } from "react-router";

const Logo = () => {
  return (
    <Link to="/">
      <div className="flex items-center gap-2">
        <img className="w-12 md:w-14" src={logo} alt="logo" />
        <h3 className="text-2xl font-semibold">GamePlan</h3>
      </div>
    </Link>
  );
};

export default Logo;
