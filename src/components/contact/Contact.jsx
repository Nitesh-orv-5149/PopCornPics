import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    // GSAP animation for form elements
    gsap.fromTo('.contact-element', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: "power2.out" }
    )
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      
      // Reset form
      setFormData({ name: '', email: '', message: '' })
      
      // Hide success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000)
    }, 1500)
  }

  const formVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-yellow-400">Contact</span> Us
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Have questions, suggestions, or feedback? We'd love to hear from you. 
            Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Contact info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-2 bg-gray-800 bg-opacity-70 p-6 rounded-xl"
          >
            <h2 className="text-xl font-bold mb-6 text-yellow-400">Get In Touch</h2>
            
            <div className="contact-element space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-yellow-500 text-gray-900 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div>
                  <h3 className="font-bold">Email</h3>
                  <p className="text-gray-400">niteshk202006official@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-yellow-500 text-gray-900 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <h3 className="font-bold">Location</h3>
                  <p className="text-gray-400">India,tamilnadu,trichy</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-yellow-500 text-gray-900 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div>
                  <h3 className="font-bold">Phone</h3>
                  <p className="text-gray-400">+91 7904601851</p>
                </div>
              </div>
            </div>
            
            <div className="contact-element mt-8">
              <h3 className="font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <motion.a 
                  href="#" 
                  whileHover={{ scale: 1.2, color: "#FBBF24" }}
                  className="bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center"
                >
                  <i className="fa-brands fa-twitter"></i>
                </motion.a>
                <motion.a 
                  href="#"
                  whileHover={{ scale: 1.2, color: "#FBBF24" }}
                  className="bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center"
                >
                  <i className="fa-brands fa-instagram"></i>
                </motion.a>
                <motion.a 
                  href="#"
                  whileHover={{ scale: 1.2, color: "#FBBF24" }}
                  className="bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center"
                >
                  <i className="fa-brands fa-facebook-f"></i>
                </motion.a>
              </div>
            </div>
          </motion.div>
          
          {/* Contact form */}
          <motion.div 
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="md:col-span-3 bg-gray-800 bg-opacity-70 p-6 rounded-xl"
          >
            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="bg-emerald-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-check text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                  <p className="text-gray-400">Your message has been sent successfully.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={itemVariants} className="contact-element">
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:outline-none focus:border-yellow-500"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants} className="contact-element">
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:outline-none focus:border-yellow-500"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants} className="contact-element">
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:outline-none focus:border-yellow-500"
                  ></textarea>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className="contact-element flex justify-end"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-full transition-all duration-300 flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Contact