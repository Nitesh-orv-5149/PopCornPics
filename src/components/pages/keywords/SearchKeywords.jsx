import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import Fuse from 'fuse.js';
import { gsap } from 'gsap';
import { ApiContext } from '../../../ApiContext';
import { motion } from 'framer-motion';
import { Card } from '../../exports';

const SearchKeywords = () => {
  const inputBoxRef = useRef(null);
  const searchContainerRef = useRef(null);
  const headerRef = useRef(null);
  const resultsRef = useRef(null);
  const loadingRef = useRef(null);
  const selectedKeywordsRef = useRef(null);
  const mediaResultsRef = useRef(null);
  
  const [showInput, setShowInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [type, setType] = useState('movie');
  
  // Constants for data
  const API_KEY = useContext(ApiContext).API_KEY;
  const [allData, setAllData] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [query, setQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  
  // State for selected keywords
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  
  // State for media results
  const [mediaResults, setMediaResults] = useState([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [mediaError, setMediaError] = useState(null);
  const [mediaPageNum, setMediaPageNum] = useState(1);
  const [showMediaResults, setShowMediaResults] = useState(false);
  
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

  // Media results animation
  useEffect(() => {
    if (mediaResults.length > 0 && mediaResultsRef.current) {
      gsap.fromTo(
        mediaResultsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [mediaResults]);

  // Selected keywords animation
  useEffect(() => {
    if (selectedKeywords.length > 0 && selectedKeywordsRef.current) {
      gsap.fromTo(
        selectedKeywordsRef.current.children,
        { scale: 0.8, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.4, 
          stagger: 0.1, 
          ease: "power2.out" 
        }
      );
    }
  }, [selectedKeywords]);

  // API calls
  const fetchAllData = async () => {
    if (query.trim() === '') {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`https://api.themoviedb.org/3/search/keyword`, {
        params: {
          query: query,
          api_key: API_KEY,
          page: pageNum,
        },
      });
      
      // Check if the response contains the expected data structure
      if (response.data && response.data.results) {
        if (resultsRef.current) {
          gsap.to(resultsRef.current, {
            opacity: 0,
            y: -10,
            duration: 0.2,
            onComplete: () => {
              setAllData(response.data.results || []);
              console.log("Keywords fetched:", response.data.results);
            }
          });
        } else {
          setAllData(response.data.results || []);
          console.log("Keywords fetched:", response.data.results);
        }
      } else {
        setError("No keywords found or invalid response format");
        setAllData([]);
      }
    } catch (error) {
      console.error("Data couldn't be fetched", error.message);
      setError("Failed to fetch keywords. Please try again.");
      setAllData([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update the fetchMediaByKeywords function
  const fetchMediaByKeywords = async () => {
    if (selectedKeywords.length === 0) {
      setMediaError("Please select at least one keyword first");
      return;
    }

    setIsLoadingMedia(true);
    setMediaError(null);
    setShowMediaResults(true);

    try {
      // Get all keyword IDs and join them with commas
      // This is the key change - join with commas to create "AND" logic
      const keywordIds = selectedKeywords.map(keyword => keyword.id).join(',');
      
      const response = await axios.get(`https://api.themoviedb.org/3/discover/${type}`, {
        params: {
          api_key: API_KEY,
          page: mediaPageNum,
          include_adult: false,
          language: 'en-US',
          sort_by: 'popularity.desc',
          with_keywords: keywordIds, // This will find media matching ALL keywords
        },
      });
      
      if (response.data && response.data.results) {
        // Animate media results
        if (mediaResultsRef.current) {
          gsap.to(mediaResultsRef.current, {
            opacity: 0,
            y: -10,
            duration: 0.2,
            onComplete: () => {
              setMediaResults(response.data.results);
              console.log(`${type} results:`, response.data.results);
            }
          });
        } else {
          setMediaResults(response.data.results);
          console.log(`${type} results:`, response.data.results);
        }
      } else {
        setMediaResults([]);
      }
    } catch (error) {
      console.error("Media couldn't be fetched", error.message);
      setMediaError(`Failed to fetch ${type}s. Please try again.`);
      setMediaResults([]);
    } finally {
      setIsLoadingMedia(false);
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
  }, [query, pageNum]);

  // Fuzzy search logic
  useEffect(() => {
    if (!query.trim()) {
      setFilteredResults([]);
      return;
    }

    if (allData.length > 0) {
      const fuse = new Fuse(allData, {
        keys: ['name'], // Keywords typically only have a 'name' property
        threshold: 0.5,
      });
      
      const results = fuse.search(query).map((result) => result.item);
      setFilteredResults(results.length > 0 ? results : allData);
    } else {
      setFilteredResults([]);
    }
  }, [query, allData]);

  // Handle page change with animation
  const handlePageChange = (newPage) => {
    // Simple scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Animate out current results
    if (resultsRef.current) {
      gsap.to(resultsRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: () => {
          setPageNum(newPage);
          // Results will animate back in via useEffect when filteredResults updates
        }
      });
    } else {
      setPageNum(newPage);
    }
  };

  // Handle media page change
  const handleMediaPageChange = (newPage) => {
    // Simple scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Animate out current results
    if (mediaResultsRef.current) {
      gsap.to(mediaResultsRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: () => {
          setMediaPageNum(newPage);
          fetchMediaByKeywords();
        }
      });
    } else {
      setMediaPageNum(newPage);
      fetchMediaByKeywords();
    }
  };

  // Handle selecting a keyword
  const handleSelectKeyword = (keyword) => {
    // Check if keyword is already selected
    const isAlreadySelected = selectedKeywords.some(item => item.id === keyword.id);
    
    if (isAlreadySelected) {
      return; // Don't add duplicates
    }
    
    // Animate the keyword being selected
    const keywordElement = document.getElementById(`keyword-${keyword.id}`);
    if (keywordElement) {
      gsap.to(keywordElement, {
        scale: 1.1,
        backgroundColor: "rgba(234, 179, 8, 0.3)",
        duration: 0.2,
        onComplete: () => {
          gsap.to(keywordElement, {
            scale: 1,
            duration: 0.2,
          });
          // Update the state after animation
          setSelectedKeywords(prev => [...prev, keyword]);
        }
      });
    } else {
      setSelectedKeywords(prev => [...prev, keyword]);
    }
  };

  // Handle removing a selected keyword
  const handleRemoveKeyword = (keywordId) => {
    // Animate the keyword being removed
    const keywordElement = document.getElementById(`selected-${keywordId}`);
    if (keywordElement) {
      gsap.to(keywordElement, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          // Update state after animation completes
          setSelectedKeywords(prev => prev.filter(k => k.id !== keywordId));
        }
      });
    } else {
      setSelectedKeywords(prev => prev.filter(k => k.id !== keywordId));
    }
  };

  // Clear all selected keywords
  const clearAllKeywords = () => {
    if (selectedKeywordsRef.current) {
      gsap.to(selectedKeywordsRef.current.children, {
        scale: 0.8,
        opacity: 0,
        stagger: 0.05,
        duration: 0.3,
        onComplete: () => {
          setSelectedKeywords([]);
          // Clear media results when keywords are cleared
          setMediaResults([]);
          setShowMediaResults(false);
        }
      });
    } else {
      setSelectedKeywords([]);
      setMediaResults([]);
      setShowMediaResults(false);
    }
  };

  // Handle content type change with animation
  const handleTypeChange = (newType) => {
    if (type !== newType) {
      setType(newType);
      
      // If we have selected keywords, fetch media for the new type
      if (selectedKeywords.length > 0) {
        setTimeout(() => {
          fetchMediaByKeywords();
        }, 300);
      }
    }
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
            <span className="text-yellow-400">KEYWORD</span>SEARCH
          </h1>
          
          {/* Selected Keywords Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-white">Selected Keywords:</h3>
              {selectedKeywords.length > 0 && (
                <button 
                  onClick={clearAllKeywords}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
            
            <div 
              ref={selectedKeywordsRef}
              className="flex flex-wrap gap-2 min-h-8"
            >
              {selectedKeywords.length === 0 ? (
                <p className="text-gray-500 text-sm">No keywords selected</p>
              ) : (
                selectedKeywords.map(keyword => (
                  <div
                    id={`selected-${keyword.id}`}
                    key={`selected-${keyword.id}`}
                    className="bg-yellow-600 bg-opacity-30 border border-yellow-500 px-3 py-1 rounded-full text-white flex items-center gap-2 transition-all"
                  >
                    <span>{keyword.name}</span>
                    <button 
                      onClick={() => handleRemoveKeyword(keyword.id)}
                      className="text-yellow-200 hover:text-white"
                    >
                      <i className="fa-solid fa-times"></i>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          
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
                placeholder="Search keywords"
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
            <div className="flex space-x-4">
              <button 
                onClick={() => handleTypeChange('movie')} 
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${type === 'movie' 
                  ? 'bg-yellow-500 text-gray-900' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Movies
              </button>
              <button 
                onClick={() => handleTypeChange('tv')} 
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${type === 'tv' 
                  ? 'bg-yellow-500 text-gray-900' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                TV Shows
              </button>
            </div>
            
            {/* Find Media Button */}
            {selectedKeywords.length > 0 && (
              <button 
                onClick={fetchMediaByKeywords}
                className="mt-4 px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:bg-yellow-400"
              >
                Find {type === 'movie' ? 'Movies' : 'TV Shows'}
              </button>
            )}
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
        
        {/* Media Loading Animation */}
        {isLoadingMedia && (
          <div className="flex justify-center items-center py-8">
            <div 
              className="rounded-full h-12 w-12 border-4 border-t-yellow-500 border-r-yellow-500 border-b-gray-700 border-l-gray-700 animate-spin"
            ></div>
          </div>
        )}
        
        {/* Error Message with Animation */}
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-white p-4 rounded-lg text-center animate-pulse">
            {error}
          </div>
        )}
        
        {/* Media Error Message */}
        {mediaError && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-white p-4 rounded-lg text-center animate-pulse my-4">
            {mediaError}
          </div>
        )}
        
        {/* Empty State Animation */}
        {!isLoading && !showMediaResults && query.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl font-bold animate-pulse">Type in the searchbar</div>
            <p className="text-gray-500 mt-2">Click "Search" to open the search field</p>
          </div>
        )}
        
        {/* No Results Animation */}
        {!isLoading && query.length > 0 && filteredResults.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl font-bold">No keywords found</div>
            <p className="text-gray-500 mt-2">Try adjusting your search terms</p>
          </div>
        )}
        
        {/* Results Grid with Animation */}
        {!showMediaResults && filteredResults.length > 0 && (
          <div ref={resultsRef} className="mt-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Keyword results for "<span className="text-yellow-400">{query}</span>"
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({filteredResults.length})
              </span>
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredResults.map((keyword) => {
                const isSelected = selectedKeywords.some(k => k.id === keyword.id);
                
                return (
                  <div 
                    id={`keyword-${keyword.id}`}
                    key={keyword.id} 
                    className={`${
                      isSelected ? 'bg-yellow-900 border border-yellow-500' : 'bg-gray-800 hover:bg-gray-700'
                    } p-4 rounded-lg transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                    onClick={() => !isSelected && handleSelectKeyword(keyword)}
                  >
                    <h3 className="text-white font-medium text-center">
                      {keyword.name}
                      {isSelected && (
                        <span className="ml-2 text-yellow-400">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      )}
                    </h3>
                  </div>
                );
              })}
            </div>
            
            {/* Pagination controls */}
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
        
        {/* Media Results */}
        {showMediaResults && (
          <div ref={mediaResultsRef} className="mt-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {type === 'movie' ? 'Movies' : 'TV Shows'} matching your keywords
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({mediaResults.length})
              </span>
            </h2>
            
            {mediaResults.length > 0 ? (
              <>
                <Card 
                  Data={mediaResults} 
                  mediaType={type} 
                  classul="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" 
                />
                
                {/* Media Pagination */}
                <motion.section 
                  className="flex gap-3 items-center justify-center mt-8 mb-4"
                >
                  <button 
                    className="bg-gray-800 hover:bg-gray-700 text-yellow-300 font-medium py-2 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleMediaPageChange(mediaPageNum - 1)} 
                    disabled={mediaPageNum === 1}
                  >
                    Prev
                  </button>
                  <p className="text-white font-medium">{mediaPageNum}</p>
                  <button 
                    className="bg-gray-800 hover:bg-gray-700 text-yellow-300 font-medium py-2 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleMediaPageChange(mediaPageNum + 1)} 
                  >
                    Next
                  </button>
                </motion.section>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-xl font-bold">No {type === 'movie' ? 'movies' : 'TV shows'} found</div>
                <p className="text-gray-500 mt-2">Try selecting different keywords</p>
              </div>
            )}
            
            {/* Back to Keywords Button */}
            <div className="flex justify-center mt-4">
              <button 
                onClick={() => setShowMediaResults(false)}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg font-medium transition-all duration-300 hover:bg-gray-600"
              >
                Back to Keywords
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchKeywords;