import React from 'react';
import { motion } from "framer-motion";


const WrapItem = ({children}) => {
    const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
    return (
        <motion.div variants={itemVariants}>
            {children}
        </motion.div>
    );
};

export default WrapItem;