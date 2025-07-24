import { useNavigate } from 'react-router';
import { FaExclamationTriangle, FaRedo, FaHome, FaBug } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 text-orange-900 flex flex-col items-center justify-center p-6 text-center">
      {/* Animated Error Icon */}
      <motion.div
        animate={{
          rotate: [-10, 10, -10],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'mirror'
        }}
        className="mb-8"
      >
        <FaExclamationTriangle className="text-6xl text-orange-500" />
      </motion.div>

      {/* Bouncing Bug */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
        className="absolute top-1/4 right-1/4 opacity-30"
      >
        <FaBug className="text-4xl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-bold mb-4">400 - Bad Request</h1>
        <p className="text-xl mb-6 max-w-lg">
          Oops! Our server got confused by your request. <br />
          It's not you, it's us... probably.
        </p>
      </motion.div>

      {/* Error Details Box */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white bg-opacity-70 p-4 rounded-lg mb-8 max-w-md w-full shadow-md"
      >
        <div className="text-left">
          <p className="font-mono text-sm mb-2">Possible reasons:</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Invalid form submission</li>
            <li>Malformed request data</li>
            <li>Missing required fields</li>
            <li>Session timeout</li>
          </ul>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="btn btn-warning btn-lg"
        >
          <FaRedo className="mr-2" />
          Try Again
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="btn btn-outline btn-lg border-orange-700 text-orange-700 hover:bg-orange-50"
        >
          <FaHome className="mr-2" />
          Go Home
        </motion.button>
      </div>

      {/* Debug Tip (visible on larger screens) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="hidden md:block mt-12 text-sm text-orange-700 text-opacity-70"
      >
        <p>Developer tip: Check your browser's console for more details</p>
        <div className="mt-2 p-2 bg-orange-100 rounded-md inline-block">
          <code className="text-xs">F12 → Console</code>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;