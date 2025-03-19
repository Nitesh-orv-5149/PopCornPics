import React, { useState, useEffect, useRef, useContext } from 'react';
import Card from '../../assets/card/Card';
import { gsap } from 'gsap';
import axios from 'axios';
import Fuse from 'fuse.js';
import { ApiContext } from './../../ApiContext';
import { motion } from 'framer-motion';

const Search = () => {
  const inputBoxRef = useRef(null);
  const searchContainerRef = useRef(null);
  const headerRef = useRef(null);
  const resultsRef = useRef(null);
  const loadingRef = useRef(null);
  
  const [showInput, setShowInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Constants for data
  const API_KEY = useContext(ApiContext).API_KEY;
  const [allData, setAllData] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [type, setType] = useState('movie');
  const [query, setQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  
  // Initial page load animation
  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(
      headerRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
    
    return () => tl.kill();
  }, []);
  
  // Animation for input - enhanced from original
  useEffect(() => {
    const inputBox = inputBoxRef.current;
    
    if (showInput) {
      // Expand input with bounce effect
      gsap.fromTo(
        inputBox,
        { width: "0px", opacity: 0 },
        { 
          width: "180px", 
          opacity: 1, 
          duration: 0.5, 
          ease: "back.out(1.7)"
        }
      );
      
      // Auto-focus the input
      setTimeout(() => inputBox?.focus(), 100);
    } else {
      // Collapse input
      gsap.to(inputBox, {
        width: "0px",
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [showInput]);

  // Loading animation
  useEffect(() => {
    if (isLoading && loadingRef.current) {
      gsap.to(loadingRef.current, {
        rotate: 360,
        repeat: -1,
        duration: 1,
        ease: "none"
      });
    }
  }, [isLoading]);
  
  // Results animation
  useEffect(() => {
    if (filteredResults.length > 0 && resultsRef.current) {
      gsap.fromTo(
        resultsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [filteredResults]);

  // API calls
  const fetchAllData = async () => {
    if (query.trim() === '') {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`https://api.themoviedb.org/3/search/${type}`, {
        params: {
          query: query,
          api_key: API_KEY,
          include_adult: false,
          include_video: false,
          language: "en-US",
          page: pageNum,
          sort_by: "popularity.desc",
        },
      });
      
      // Animate the transition of new results
      if (resultsRef.current) {
        gsap.to(resultsRef.current, {
          opacity: 0,
          y: -10,
          duration: 0.2,
          onComplete: () => {
            setAllData(response.data.results || []);
          }
        });
      } else {
        const newResults = response.data.results.filter(
          item => item.poster_path 
       );
        setAllData(newResults || []);
      }
      
    } catch (error) {
      console.error("Data couldn't be fetched", error.message);
      setError("Failed to fetch results. Please try again.");
      setAllData([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Debounce calls
  useEffect(() => {
    if (query.trim() === '') {
      setFilteredResults([]);
      return;
    }
    
    const delayBounce = setTimeout(() => {
      fetchAllData();
    }, 1000);
    
    return () => clearTimeout(delayBounce);
  }, [query, type]);

  // Fuzzy search logic
  useEffect(() => {
    if (!query.trim()) {
      setFilteredResults([]);
      return;
    }

    if (allData.length > 0) {
      const fuse = new Fuse(allData, {
        keys: ['title', 'name', 'overview'],
        threshold: 0.5,
      });
      
      const results = fuse.search(query).map((result) => result.item);
      setFilteredResults(results.length > 0 ? results : []);
    }
  }, [query, allData, pageNum]);

  // Load more results with animation
  const loadMoreResults = () => {
    gsap.to(window, {
      scrollTo: { y: document.body.scrollHeight, autoKill: false },
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => setPageNum(prev => prev + 1)
    });
  };
  
  // Handle content type change with animation
  const handleTypeChange = (newType) => {
    if (type !== newType) {
      // Animate current results out
      if (resultsRef.current) {
        gsap.to(resultsRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          onComplete: () => {
            setType(newType);
            setPageNum(1);
            // Results will animate back in via useEffect when filteredResults updates
          }
        });
      } else {
        setType(newType);
        setPageNum(1);
      }
    }
  };

  const handlePageChange = (newPage) => {
      // Simple scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setPageNum(newPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-8 px-4" ref={searchContainerRef}>
      <div className="max-w-6xl mx-auto">
        {/* Search Header */}
        <div 
          ref={headerRef}
          className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-blue-900/10"
        >
          <h1 className="text-3xl font-bold text-center text-white mb-6">
            <span className="text-yellow-400">POPCORN</span>PICS
          </h1>
          
          {/* Search with original animation */}
          <div className="flex flex-col justify-center items-center gap-4 mb-6">
            <div className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-search flex text-center text-gray-400"></i>
              <input 
                className="w-0 opacity-0 p-2 rounded-4xl bg-gray-700 text-white" 
                onChange={(e) => setQuery(e.target.value)} 
                type="text" 
                name="search" 
                ref={inputBoxRef}
                placeholder="Search movies & shows"
              />
              <button 
                onClick={() => {
                  setShowInput(!showInput);
                  // Add button click animation
                  gsap.fromTo(
                    ".fa-search",
                    { rotate: 0, scale: 1 },
                    { rotate: showInput ? 0 : 360, scale: showInput ? 1 : 1.2, duration: 0.4, ease: "back.out(1.7)" }
                  );
                }} 
                className="flex items-center gap-2 hover:text-white text-gray-400 transition-colors"
              >
                Search
              </button>
            </div>
            
            {/* Content Type Selector with hover animations */}
            <div className="flex space-x-2">
              <button 
                onClick={() => handleTypeChange('movie')} 
                className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${type === 'movie' 
                  ? 'bg-yellow-500 text-gray-900' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Movies
              </button>
              <button 
                onClick={() => handleTypeChange('tv')} 
                className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${type === 'tv' 
                  ? 'bg-yellow-500 text-gray-900' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                TV Shows
              </button>
            </div>
          </div>
        </div>
        
        {/* Loading Animation */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div 
              ref={loadingRef}
              className="rounded-full h-12 w-12 border-4 border-t-yellow-500 border-r-yellow-500 border-b-gray-700 border-l-gray-700"
            ></div>
          </div>
        )}
        
        {/* Error Message with Animation */}
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-white p-4 rounded-lg text-center animate-pulse">
            {error}
          </div>
        )}
        
        {/* Empty State Animation */}
        {!isLoading && query.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl font-bold animate-pulse">Type in the searchbar</div>
            <p className="text-gray-500 mt-2">Click "Search" to open the search field</p>
          </div>
        )}
        
        {/* No Results Animation */}
        {!isLoading && query.length > 0 && filteredResults.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl font-bold">No results found</div>
            <p className="text-gray-500 mt-2">Try adjusting your search terms or content type</p>
          </div>
        )}
        
        {/* Results Grid with Animation */}
        {filteredResults.length > 0 && (
          <div ref={resultsRef} className="mt-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Results for "<span className="text-yellow-400">{query}</span>"
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({filteredResults.length})
              </span>
            </h2>
            
            <div className="overflow-hidden w-full">
              <Card Data={filteredResults} mediaType={type}  classul="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" />
            </div>
            
            {filteredResults.length >= 20 && (
              <motion.section 
                  className="flex gap-3 items-center justify-center mt-8 mb-4"
              >
                  <button 
                      className="bg-gray-800 hover:bg-gray-700 text-yellow-300 font-medium py-2 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handlePageChange(pageNum - 1)} 
                      disabled={pageNum === 1}
                  >
                      Prev
                  </button>
                  <p className="text-white font-medium">{pageNum}</p>
                  <button 
                      className="bg-gray-800 hover:bg-gray-700 text-yellow-300 font-medium py-2 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handlePageChange(pageNum + 1)} 
                      disabled={filteredResults.length < 20}
                  >
                      Next
                  </button>
              </motion.section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;