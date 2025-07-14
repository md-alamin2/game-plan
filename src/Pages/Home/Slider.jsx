import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { FaArrowRight, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";

const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading;
    axios
      .get("/slider.json")
      .then((res) => {
        setSlides(res.data);
        setLoading(false);
      })
      .catch((error) => {
        alert("Error fetching slider data:", error);
      });
  }, []);

  return (
    <div className="relative h-[80vh]">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="hero-overlay">
                <div className=" flex flex-col justify-center h-full px-8 md:px-16 lg:px-24 text-white">
                  <div className="max-w-3xl space-y-6">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                      {slide.title}
                    </h2>
                    <p className="text-xl md:text-2xl font-semibold text-primary">
                      {slide.tagline}
                    </p>
                    <p className="text-lg md:text-xl">{slide.description}</p>
                    <div className="flex flex-wrap gap-4 mt-8">
                      <Link to="/courts">
                        <button className="btn btn-primary flex items-center">
                          <FaCalendarAlt /> Book Court <FaArrowRight />
                        </button>
                      </Link>
                      <Link>
                        <button className="btn btn-secondary">
                          <FaInfoCircle /> Learn More <FaArrowRight />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
