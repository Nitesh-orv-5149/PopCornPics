import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import axios from "axios";
import gsap from "gsap";
import { Card } from "../../components/exports";

const Carousal = ({ 
  apiEndpoint,
  apiKey,
  carouselRef,
  contentRef,
  initialPageNum = 1,
  params = {},
  theme,
  title,
  titleHighlight,
  showTypeSelector = true,
  initialType = "movie",
  onDataLoad = () => {},
  onTypeChange = () => {} // Add callback for type changes
}) => {
  const [data, setData] = useState([]);
  const [pageNum, setPageNum] = useState(initialPageNum);
  const [type, setType] = useState(initialType);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(0);
  const [currentTitle, setCurrentTitle] = useState(title);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Build appropriate API endpoint based on props
      const endpoint = apiEndpoint.replace("{type}", type);
      
      // Combine default params with any additional params passed in
      const requestParams = {
        api_key: apiKey,
        include_adult: false,
        language: "en-US",
        page: pageNum,
        ...params
      };
      
      const response = await axios.get(endpoint, { params: requestParams });
      setData(response.data.results);
      setPages(response.data.total_pages || 1);
      
      // Notify parent component about the new data
      onDataLoad(response.data.results);
      
      if (carouselRef.current) {
        gsap.to(carouselRef.current, {
          scrollLeft: 0,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    } catch (error) {
      console.error("Data couldn't be fetched", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Set title based on type
  useEffect(() => {
    if (showTypeSelector) {
      setCurrentTitle(type === "movie" ? "Movies" : "TV Shows");
    } else {
      setCurrentTitle(title);
    }
  }, [type, title, showTypeSelector]);

  useEffect(() => {
    fetchData();
  }, [type, pageNum, apiEndpoint]);

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    
    // Add animation when changing type
    gsap.to(contentRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      onComplete: () => {
        setType(newType);
        onTypeChange(newType); // Notify parent component about type change
        gsap.to(contentRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.2
        });
      }
    });
  };

  return (
    <>
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <motion.h1 
          className='text-3xl md:text-4xl font-extrabold mb-4 sm:mb-0'
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}>
          <motion.span 
            className={`${theme === "dark" ? "text-yellow-400" : "text-yellow-600"}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}>
            {titleHighlight}
          </motion.span> {currentTitle}
        </motion.h1>
        
        {showTypeSelector && (
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}>
            <motion.div 
              className={`relative inline-block rounded-full overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"} border border-yellow-500`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <select 
                className={`appearance-none pl-4 pr-10 py-2 rounded-full outline-none ${theme === "dark" ? "bg-gray-800 text-yellow-400" : "bg-gray-200 text-yellow-600"} font-medium`}
                value={type}
                onChange={handleTypeChange}>
                <option value="movie">Movies</option>
                <option value="tv">TV Shows</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Content section */}
      <motion.div 
        ref={contentRef}
        className={`relative rounded-xl overflow-hidden ${theme === "dark" ? "bg-gray-800/30 shadow-2xl" : "bg-white shadow-lg"} mb-8`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}>
        {loading && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
              <p className="mt-4 text-yellow-400 font-medium">Loading...</p>
            </div>
          </motion.div>
        )}
        
        <div className="p-4">
          <div 
            ref={carouselRef} 
            className="overflow-x-auto py-4 scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-transparent"
            style={{ scrollBehavior: 'smooth' }}>
            <Card Data={data} classul="flex gap-4" mediaType={type} />
          </div>
        </div>
      </motion.div>
      
      {/* Pagination controls */} 
      <motion.div 
        className="flex flex-col sm:flex-row items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}>
        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-4 sm:mb-0`}>
          Showing page {pageNum} of {pages}
        </p>
        
        <div className="flex items-center gap-2">
          <motion.button 
            className={`px-4 py-2 rounded-lg transition-all ${pageNum === 1 
              ? `${theme === "dark" ? "bg-gray-700 text-gray-500" : "bg-gray-200 text-gray-400"} cursor-not-allowed` 
              : `${theme === "dark" ? "bg-yellow-600 hover:bg-yellow-500" : "bg-yellow-500 hover:bg-yellow-400"} text-gray-900 shadow hover:shadow-lg`}`}
            onClick={() => setPageNum((prev) => Math.max(prev - 1, 1))} 
            disabled={pageNum === 1}
            whileHover={{ scale: pageNum === 1 ? 1 : 1.05 }}
            whileTap={{ scale: pageNum === 1 ? 1 : 0.95 }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </motion.button>
          
          <motion.div 
            className={`px-4 py-1 min-w-[3rem] text-center font-bold ${theme === "dark" ? "bg-gray-800 text-yellow-400" : "bg-gray-100 text-yellow-600"} rounded-lg`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}>
            {pageNum}
          </motion.div>
          
          <motion.button 
            className={`px-4 py-2 rounded-lg transition-all ${pageNum === pages 
              ? `${theme === "dark" ? "bg-gray-700 text-gray-500" : "bg-gray-200 text-gray-400"} cursor-not-allowed` 
              : `${theme === "dark" ? "bg-yellow-600 hover:bg-yellow-500" : "bg-yellow-500 hover:bg-yellow-400"} text-gray-900 shadow hover:shadow-lg`}`}
            onClick={() => setPageNum((prev) => Math.min(prev + 1, pages))}
            disabled={pageNum === pages}
            whileHover={{ scale: pageNum === pages ? 1 : 1.05 }}
            whileTap={{ scale: pageNum === pages ? 1 : 0.95 }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default Carousal;