import { FaTrophy, FaUsers, FaHeart, FaStar } from "react-icons/fa";
import img from "../../assets/about-img.jpg";

const About = () => {
  return (
    <div className="mt-20 bg-base-100">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Elite Sports Club
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            For over a decade, we've been the premier destination for sports
            enthusiasts, offering world-class facilities and fostering a
            community of excellence.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-12">
          <div className="grid grid-cols-1 gap-4 mb-16">
            {/* History */}
            <div className="p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-base-200 p-4 rounded-full">
                  <FaTrophy className="text-primary" />
                </span>
                Our History
              </h2>
              <p className="opacity-70 font-medium">
                Founded in 2014, Elite Sports Club began as a vision to create
                the ultimate sports facility. What started with 3 tennis courts
                has grown into a comprehensive sports complex featuring tennis,
                badminton, squash courts, and state-of-the-art fitness
                facilities.
              </p>
            </div>

            {/* Mission */}
            <div className="p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-base-200 p-4 rounded-full"><FaHeart className="text-primary" /></span>
                Our Mission
              </h2>
              <p className="opacity-70 font-medium">
                To provide exceptional sports facilities and services that
                inspire our members to achieve their personal best. We believe
                in fostering a community where athletes of all levels can train,
                compete, and grow together.
              </p>
            </div>

            {/* Values */}
            <div className="p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-base-200 p-4 rounded-full"><FaStar className="text-primary" /></span>
                Our Values
              </h2>
              <p className="opacity-70 font-medium mb-4">
                Excellence, integrity, and community are at the heart of
                everything we do. We're committed to maintaining the highest
                standards in facilities, coaching, and member experience.
              </p>
            </div>
          </div>

          {/* Years of Excellence Badge */}
          <div className="relative">
            <img className="rounded-lg h-[calc(100%-65px)]" src={img} alt="" />
            <div className="bg-primary rounded-2xl px-2 py-3 w-40 absolute top-70 -left-10">
              <h3 className="text-3xl font-bold text-white">10+</h3>
              <p className="text-base font-medium text-white">
                Years of Excellence
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
