import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

const About = () => {

  const teamMembers = [
    { name: 'Nitesh Kumar', role: 'Founder & Lead Developer' },
    { name: 'name', role: 'role' },

  ]

  useEffect(() => {
    // GSAP stagger animation for team members
    gsap.fromTo('.team-member', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: "power2.out", delay: 0.5 }
    )
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-800 bg-opacity-70 rounded-xl shadow-xl p-8 mb-12"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-4xl font-bold mb-6 text-center"
          >
            <span className="text-yellow-400">About</span> PopcornPics
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-gray-300 mb-6 text-lg">
            PopcornPics is your ultimate destination for discovering movies and TV shows that match your taste. 
            Our platform brings together a vast library of content from across the streaming universe.
          </motion.p>
          
          <motion.p variants={itemVariants} className="text-gray-300 mb-10">
            Founded in 2024, we're on a mission to make entertainment discovery seamless and enjoyable. 
            No more endless scrolling through streaming platforms - find exactly what you want to watch, when you want to watch it.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
          >
            <div className="bg-black bg-opacity-50 p-4 rounded-lg">
              <div className="bg-yellow-500 text-gray-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fa-solid fa-film text-xl"></i>
              </div>
              <h3 className="font-bold text-lg mb-2 text-yellow-400">Vast Library</h3>
              <p className="text-gray-400 text-sm">Access to thousands of movies and shows across all genres</p>
            </div>
            
            <div className="bg-black bg-opacity-50 p-4 rounded-lg">
              <div className="bg-yellow-500 text-gray-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
              </div>
              <h3 className="font-bold text-lg mb-2 text-yellow-400">Smart Recommendations</h3>
              <p className="text-gray-400 text-sm">Personalized suggestions based on your viewing history</p>
            </div>
            
            <div className="bg-black bg-opacity-50 p-4 rounded-lg">
              <div className="bg-yellow-500 text-gray-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fa-solid fa-bell text-xl"></i>
              </div>
              <h3 className="font-bold text-lg mb-2 text-yellow-400">Stay Updated</h3>
              <p className="text-gray-400 text-sm">Get notified about new releases and trending content</p>
            </div>
          </motion.div>
        </motion.div>
        
        <h2 className="text-2xl font-bold mb-8 text-center">Our Team</h2>

        <ul className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {teamMembers.map((member, index) => (
            <li key={index} className="team-member opacity-0 bg-gray-800 bg-opacity-50 p-4 rounded-lg text-center">
              <div className="w-20 h-20 rounded-full bg-gray-700 mx-auto mb-3"></div>
              <h3 className="font-bold">{member.name}</h3>
              <p className="text-sm text-gray-400">{member.role}</p>
            </li>
          ))}
        </ul>

        <section className='flex flex-col justify-center items-center mt-15 gap-10'>
          <h1 className="font-bold text-3xl">Our contributors</h1>
          <a className='hover:underline hover:text-yellow-400 ' href="https://www.themoviedb.org/">TMDB</a>
          <a className='hover:underline hover:text-yellow-400 ' href="https://www.justwatch.com/">Justwatch</a>
        </section>

      </div>
    </div>
  )
}

export default About