import { useLocation, useNavigate } from 'react-router';
import { FaLock, FaHome, FaSignInAlt, FaRobot } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white flex flex-col items-center justify-center p-6 text-center">
      {/* Animated Robot Guard */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
        className="mb-8"
      >
        <FaRobot className="text-6xl text-yellow-300" />
      </motion.div>

      {/* Lock Icon with Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="mb-6"
      >
        <FaLock className="text-5xl text-red-400" />
      </motion.div>

      <h1 className="text-5xl font-bold mb-4">403 - Access Denied</h1>
      
      <p className="text-xl mb-8 max-w-lg">
        Whoops! Our digital bouncer says you don't have VIP access to this area.
      </p>

      {/* Animated Laser Grid */}
      <div className="relative w-full max-w-md h-1 mb-10 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-full w-0.5 bg-red-500"
            style={{ left: `${i * 10}%` }}
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.2,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {/* Home Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="btn btn-primary btn-lg"
        >
          <FaHome className="mr-2" />
          Back to Safety
        </motion.button>

        {/* Login Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/login')}
          className="btn btn-secondary btn-lg"
        >
          <FaSignInAlt className="mr-2" />
          Try Admin Access
        </motion.button>
      </div>

      {/* Easter Egg - Only visible on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="mt-12 text-sm text-purple-300"
      >
        <p>Psst... want to know a secret?</p>
        <p className="text-xs mt-2">The guard robot accepts virtual cookies as bribes 🍪</p>
      </motion.div>
    </div>
  );
};

export default ForbiddenPage;