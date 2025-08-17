import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../../../Components/Sheared/Loading";
import TipCard from "./TipCard";

const TipsSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/tips.json")
      .then((res) => res.json())
      .then((data) => {
        setTips(data);
        setLoading(false);
      });
  }, []);

  // Filter tips by category
  const filteredTips =
    activeCategory === "all"
      ? tips
      : tips.filter((tip) => tip.category === activeCategory);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <motion.section 
      className="mt-18 md:mt-40 bg-base-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-2">Pro Tips & Advice</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Expert advice to improve your performance
          </p>
        </motion.div>

        {/* Category Filter Buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {["all", "training", "nutrition", "recovery", "mental"].map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`btn ${
                activeCategory === category ? "btn-primary text-white" : "btn-ghost"
              } capitalize`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {category === "all" ? "All Tips" : category}
            </motion.button>
          ))}
        </motion.div>

        {/* Tips Grid */}
        {loading ? (
          <Loading />
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {filteredTips.map((tip) => (
                <motion.div
                  key={tip.id}
                  variants={itemVariants}
                  layout // Add layout animation for smooth reordering
                >
                  <TipCard tip={tip} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default TipsSection;