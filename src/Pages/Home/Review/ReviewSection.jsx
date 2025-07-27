import React from "react";
import Review from "./Review";

const ReviewSection = () => {
  return (
    <div>
      <h2 className="text-4xl md:text-5xl font-bold text-center mt-18 md:mt-40">
        What our clients are sayings
      </h2>
      <p className="text-lg text-gray-600 text-center max-w-[660px] mx-auto mt-6">
        Honest feedback from clients  helping you make the best choices for you.
      </p>
      <Review></Review>
    </div>
  );
};

export default ReviewSection;
