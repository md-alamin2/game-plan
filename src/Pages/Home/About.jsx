import { FaTrophy, FaUsers, FaHeart, FaStar } from "react-icons/fa";
import img from "../../assets/about-img.jpg";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 }
  }),
};

const About = () => {
  return (
    <div className="mt-18 md:mt-40 bg-base-100">
      <motion.div 
        className="container mx-auto px-4 max-w-6xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.3 }}
      >
        {/* Header Section */}
        <motion.div className="text-center mb-16" variants={fadeInUp}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Elite Sports Club
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            For over a decade, we've been the premier destination for sports
            enthusiasts, offering world-class facilities and fostering a
            community of excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
          <div className="grid grid-cols-1 gap-4 md:mb-16">
            {/* History */}
            <motion.div 
              className="p-8 rounded-lg shadow-md border border-gray-300"
              variants={fadeInUp}
              custom={1}
            >
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
            </motion.div>

            {/* Mission */}
            <motion.div 
              className="p-8 rounded-lg shadow-md border border-gray-300"
              variants={fadeInUp}
              custom={2}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-base-200 p-4 rounded-full">
                  <FaHeart className="text-primary" />
                </span>
                Our Mission
              </h2>
              <p className="opacity-70 font-medium">
                To provide exceptional sports facilities and services that
                inspire our members to achieve their personal best. We believe
                in fostering a community where athletes of all levels can train,
                compete, and grow together.
              </p>
            </motion.div>

            {/* Values */}
            <motion.div 
              className="p-8 rounded-lg shadow-md border border-gray-300"
              variants={fadeInUp}
              custom={3}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-base-200 p-4 rounded-full">
                  <FaStar className="text-primary" />
                </span>
                Our Values
              </h2>
              <p className="opacity-70 font-medium mb-4">
                Excellence, integrity, and community are at the heart of
                everything we do. We're committed to maintaining the highest
                standards in facilities, coaching, and member experience.
              </p>
            </motion.div>
          </div>

          {/* Years of Excellence Badge */}
          <motion.div 
            className="relative"
            variants={fadeInUp}
            custom={4}
          >
            <img className="rounded-lg w-full h-[calc(100%-65px)]" src={img} alt="" />
            <div className="bg-primary rounded-2xl px-2 py-3 w-40 absolute left-8 top-96 md:top-70 md:-left-4 lg:-left-10">
              <h3 className="text-3xl font-bold text-white">10+</h3>
              <p className="text-base font-medium text-white">
                Years of Excellence
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
