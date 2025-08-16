import React from "react";
import Slider from "./Slider";
import StatsSection from "./StatsSection";
import About from "./About";
import Location from "./Location";
import ExclusiveOffers from "./ExclusiveOffers";
import ReviewSection from "./Review/ReviewSection";
import { motion } from "framer-motion";
import Brands from "./Brands";
import TipsSection from "./Tips/Tips";

const Home = () => {
  return <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.4}}>
    <title>Home</title>
    <Slider></Slider>
    <StatsSection></StatsSection>
    <About></About>
    <TipsSection></TipsSection>
    <Location></Location>
    <ReviewSection></ReviewSection>
    <ExclusiveOffers></ExclusiveOffers>
    <Brands></Brands>
  </motion.div>;
};

export default Home;
