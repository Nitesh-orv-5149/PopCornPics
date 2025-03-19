import React from 'react'
import './app.css'
import { Navbar, Hero, Footer } from '../exports'
import { motion } from 'framer-motion'

const App = () => {
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6 }
  }

  return (
    <motion.div 
      className="min-h-screen flex flex-col bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <motion.main 
        className="flex-grow container mx-auto px-4 py-8"
        {...fadeIn}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Hero />
      </motion.main>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Footer />
      </motion.div>
    </motion.div>
  )
}

export default App