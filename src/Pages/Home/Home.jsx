import React from "react";
import Slider from "./Slider";
import StatsSection from "./StatsSection";
import About from "./About";
import Location from "./Location";

const Home = () => {
  return <div>
    <Slider></Slider>
    <StatsSection></StatsSection>
    <About></About>
    <Location></Location>
  </div>;
};

export default Home;
