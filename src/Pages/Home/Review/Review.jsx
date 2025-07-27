import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaAngleLeft, FaQuoteLeft } from "react-icons/fa";
import { useRef, useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import img from "../../../assets/profile.png";
import useAxios from "../../../Hooks/useAxios";
import Loading from "../../../Components/Sheared/Loading";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const axiosInstance = useAxios();
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [swiperReady, setSwiperReady] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosInstance.get("reviews").then((res) => {
      setReviews(res.data);
      setLoading(false);
    });
    setSwiperReady(true);
  }, [axiosInstance]);

  if (loading) return <Loading></Loading>;

  return (
    <div className="w-full mt-20">
      {swiperReady && (
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          slidesPerView={1}
          spaceBetween={30}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 10,
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          onSwiper={(swiper) => {
            // Navigation manually init & update
            setTimeout(() => {
              swiper.navigation.init();
              swiper.navigation.update();
              swiper.pagination.init();
              swiper.pagination.render();
              swiper.pagination.update();
            });
          }}
          breakpoints={{
            300: { slidesPerView: 1 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
          className="w-full"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              {({ isActive }) => (
                <div
                  className={`rounded-xl my-8 py-6 px-2 md:py-6 md:px-4 transition duration-600 mx-auto ${
                    isActive
                      ? "bg-gradient-to-br from-primary from-40% to-secondary to-80% shadow-xl md:scale-108 text-white"
                      : "bg-base-200 opacity-50"
                  }`}
                >
                  <FaQuoteLeft className="text-3xl mb-4" />
                  <h3 className="font-bold text-lg">{review.courtName}</h3>
                  <p className="">"{review.review}"</p>
                  <div className="rating rating-sm mt-2">
                    {[...Array(5)].map((_, i) => (
                      <input
                        key={i}
                        type="radio"
                        className="mask mask-star-2 bg-orange-400"
                        checked={review.rating === i + 1}
                        readOnly
                      />
                    ))}
                  </div>
                  <div className="divider my-2"></div>

                  <div className="flex items-center gap-2 mt-4">
                    <img
                      src={review.user.img ? review.user.img : img}
                      className="w-13 rounded-full"
                    />
                    <div>
                      <h4 className="text-lg font-semibold">
                        {review.user.name}
                      </h4>
                    </div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Pagination + Navigation */}
      {/* <div className="flex flex-col items-center justify-center mt-4">
        <div className="flex gap-4">
          <button
            ref={prevRef}
            className="btn btn-outline btn-primary rounded-full"
          >
            <FaAngleLeft size={20}></FaAngleLeft>
          </button>
          <button
            ref={nextRef}
            className="btn btn-outline btn-primary rounded-full"
          >
            <FaAngleRight size={20}></FaAngleRight>
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default Review;
