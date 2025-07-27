import React from 'react';
import { motion } from "framer-motion";


const WrapTr = ({children}) => {
    const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
    return (
        <motion.tr variants={itemVariants} transition={{duration:0.4}}  className="hover:bg-gray-50 text-center">
            {children}
        </motion.tr>
    );
};

export default WrapTr;