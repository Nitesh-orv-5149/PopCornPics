import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { text: "home", icon: "fa-solid fa-house", path: "/home" },
    { text: "about", icon: "fa-solid fa-info", path: "/about" },
    { text: "contact", icon: "fa-solid fa-phone", path: "/contact" },
    { text: "profile", icon: "fa-solid fa-user", path: "/profile" },
    { text: "genres", icon: "fa-solid fa-list", path: "/genrespage" },
    { text: "collections", icon: "fa-solid fa-folder", path: "/collections" },
    { text: "bookmarked", icon: "fa-solid fa-bookmark", path: "/bookmarked" },
    { text: "searchkeywords", icon: "fa-solid fa-search", path: "/searchkeywords" },
  ];

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  // Mobile menu animations
  const menuVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: { duration: 0.3 }
    }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <>
      <motion.nav 
        className="fixed top-0 left-0 w-full text-gray-400 py-4 z-50 bg-gradient-to-b from-black to-transparent backdrop-blur-sm"
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        {/* Desktop menu */}
        <motion.div 
          className="hidden sm:flex justify-center gap-6"
          variants={navVariants}
        >
          {navItems.map((item, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.1, color: "#ffffff" }}
              whileTap={{ scale: 0.95 }}
            >
              <Link className='flex flex-row gap-1 justify-center items-center' to={item.path}>
                <h1>{item.text}</h1>
                <i className={item.icon}></i>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile menu button */}
        <motion.button 
          onClick={() => setIsOpen(!isOpen)} 
          className="absolute right-5 top-3 p-4 hover:text-white text-gray-400 sm:hidden"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <i className="fa-solid fa-bars"></i>
        </motion.button>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed top-0 left-0 w-full h-screen bg-gray-900 flex flex-col items-center justify-center gap-6 sm:hidden z-40"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {navItems.map((item, index) => (
                <motion.div 
                  key={index}
                  variants={menuItemVariants}
                  whileHover={{ scale: 1.1, x: 10, color: "#ffffff" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    className='flex flex-row gap-1 justify-center items-center text-xl' 
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                  >
                    <h1>{item.text}</h1>
                    <i className={item.icon}></i>
                  </Link>
                </motion.div>
              ))}
              <motion.button 
                onClick={() => setIsOpen(false)} 
                className="absolute top-5 right-5 hover:text-white text-gray-400 text-2xl"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fa-solid fa-xmark"></i>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}

export default Navbar