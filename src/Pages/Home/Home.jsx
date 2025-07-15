import React from "react";
import Slider from "./Slider";
import StatsSection from "./StatsSection";
import About from "./About";
import Location from "./Location";
import ExclusiveOffers from "./ExclusiveOffers";

const Home = () => {
  return <div>
    <Slider></Slider>
    <StatsSection></StatsSection>
    <About></About>
    <Location></Location>
    <ExclusiveOffers></ExclusiveOffers>
  </div>;
};

export default Home;
