import React from 'react'
import { Link } from 'react-router-dom'
import { Search } from '../exports'
import { motion } from 'framer-motion'

const Hero = () => {
  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }
  
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }
  
  const featuresVariant = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.8
      }
    }
  }
  
  const featureItem = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  }

  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-24 lg:py-32 px-6 text-white bg-gradient-to-b from-gray-900 to-black"
      initial="hidden"
      animate="show"
      variants={staggerContainer}
    >
      <motion.h1 
        className="text-5xl lg:text-7xl font-extrabold text-center mb-6"
        variants={fadeUp}
      >
        <motion.span 
          className="text-yellow-400"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          POPCORN
        </motion.span>
        <motion.span
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          PICS
        </motion.span>
      </motion.h1>
      
      <motion.p 
        className="text-xl text-center max-w-2xl mb-8 text-gray-300"
        variants={fadeUp}
      >
        Your ultimate destination for discovering movies and TV shows that match your taste
      </motion.p>
      
      <motion.div
        variants={fadeUp}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link 
          to="/search" 
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-full transition-all duration-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search Movies & TV Shows
        </Link>
      </motion.div>
      
      <motion.div 
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl"
        variants={featuresVariant}
      >
        <motion.div 
          className="p-4 bg-black bg-opacity-50 rounded-lg text-center"
          variants={featureItem}
          whileHover={{ 
            scale: 1.05, 
            backgroundColor: "rgba(0,0,0,0.7)",
            boxShadow: "0 0 15px rgba(255, 204, 0, 0.3)"
          }}
        >
          <p className="font-bold text-yellow-400">Extensive Library</p>
          <p className="text-sm text-gray-400">Thousands of titles</p>
        </motion.div>
        <motion.div 
          className="p-4 bg-black bg-opacity-50 rounded-lg text-center"
          variants={featureItem}
          whileHover={{ 
            scale: 1.05, 
            backgroundColor: "rgba(0,0,0,0.7)",
            boxShadow: "0 0 15px rgba(255, 204, 0, 0.3)"
          }}
        >
          <p className="font-bold text-yellow-400">Personalized</p>
          <p className="text-sm text-gray-400">Tailored recommendations</p>
        </motion.div>
        <motion.div 
          className="p-4 bg-black bg-opacity-50 rounded-lg text-center"
          variants={featureItem}
          whileHover={{ 
            scale: 1.05, 
            backgroundColor: "rgba(0,0,0,0.7)",
            boxShadow: "0 0 15px rgba(255, 204, 0, 0.3)"
          }}
        >
          <p className="font-bold text-yellow-400">Up-to-date</p>
          <p className="text-sm text-gray-400">Latest releases</p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Hero