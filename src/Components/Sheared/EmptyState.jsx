import { FaBoxOpen, FaSearch, FaPlusCircle, FaFrown } from 'react-icons/fa';
import { motion } from 'framer-motion';

const EmptyState = ({ 
  title = "No Data Found",
  message = "There's nothing to display here yet",
  iconType = "default", // "default" | "search" | "add" | "sad"
  actionButton,
  className = ""
}) => {
  // Select icon based on type
  const getIcon = () => {
    switch (iconType) {
      case "search":
        return <FaSearch className="text-4xl text-blue-400" />;
      case "add":
        return <FaPlusCircle className="text-4xl text-green-400" />;
      case "sad":
        return <FaFrown className="text-4xl text-yellow-400" />;
      default:
        return <FaBoxOpen className="text-4xl text-gray-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center p-8 text-center border border-gray-300 rounded-2xl max-w-xl mx-auto ${className}`}
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3
        }}
        className="mb-4"
      >
        {getIcon()}
      </motion.div>

      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mb-6">{message}</p>

      {actionButton && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {actionButton}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;