import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Footer = () => {
  const linkVariants = {
    hover: { scale: 1.1, color: "#10B981", transition: { duration: 0.2 } }
  }

  return (
    <footer className="bg-gray-900 text-gray-400 py-8">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center"
        >
          <div className="mb-6 md:mb-0">
            <motion.h2 
              className="text-2xl font-bold mb-2"
              whileHover={{ color: "#FBBF24" }}
            >
              <span className="text-yellow-400">POPCORN</span>PICS
            </motion.h2>
            <p className="text-sm">Your ultimate movie & TV companion</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <motion.div whileHover="hover">
              <motion.a 
                href="#" 
                className="flex items-center gap-2"
                variants={linkVariants}
              >
                <i className="fa-solid fa-envelope"></i>
                <span>Contact</span>
              </motion.a>
            </motion.div>
            
            <motion.div whileHover="hover">
              <motion.a 
                href="#" 
                className="flex items-center gap-2"
                variants={linkVariants}
              >
                <i className="fa-solid fa-circle-info"></i>
                <span>About</span>
              </motion.a>
            </motion.div>
            
            <motion.div whileHover="hover">
              <motion.a 
                href="#" 
                className="flex items-center gap-2"
                variants={linkVariants}
              >
                <i className="fa-solid fa-shield"></i>
                <span>Privacy</span>
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="border-t border-gray-800 mt-6 pt-6 text-center text-sm"
        >
          <p>&copy; {new Date().getFullYear()} PopcornPics. All rights reserved.</p>
        </motion.div>
       
      </div>
    </footer>
  )
}

export default Footer