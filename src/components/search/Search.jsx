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
  const [totalPages, setTotalPages] = useState(0);
  const [query, setQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  
  // Enhanced content type state
  const [contentType, setContentType] = useState('movie'); // 'movie', 'tv', 'anime_movie', 'anime_tv'
  
  // New sorting options
  const [sortBy, setSortBy] = useState('popularity.desc'); // Default: popularity descending
  
  // New search strictness toggle
  const [strictSearch, setStrictSearch] = useState(true);
  
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

  // Get actual media type based on content type
  const getMediaType = () => {
    return contentType.startsWith('anime') ? contentType.split('_')[1] : contentType;
  };

  // Is content anime?
  const isAnime = () => {
    return contentType.startsWith('anime');
  };

  // API calls
  const fetchAllData = async () => {
    if (query.trim() === '') {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Determine the actual media type to search (movie or tv)
      const mediaType = getMediaType();
      
      // First, search for basic results
      const response = await axios.get(`https://api.themoviedb.org/3/search/${mediaType}`, {
        params: {
          query: query,
          api_key: API_KEY,
          include_adult: false,
          include_video: false,
          language: "en-US",
          page: pageNum,
          sort_by: sortBy // Apply sorting parameter
        },
      });
      
      let results = response.data.results || [];
      
      // Store total pages for pagination
      setTotalPages(response.data.total_pages || 0);
      
      // Filter for anime if needed
      if (isAnime()) {
        // Get details for each result to check if it's anime
        const detailedResults = await Promise.all(
          results.map(async (item) => {
            try {
              // Get details including genres
              const detailsResponse = await axios.get(
                `https://api.themoviedb.org/3/${mediaType}/${item.id}`, {
                  params: {
                    api_key: API_KEY,
                    append_to_response: 'keywords'
                  }
                }
              );
              
              // Check if it's animation genre (16) and from Japan
              const isAnimation = detailsResponse.data.genres?.some(genre => genre.id === 16);
              const isJapanese = detailsResponse.data.origin_country?.includes('JP') || 
                               detailsResponse.data.production_countries?.some(country => country.iso_3166_1 === 'JP');
              
              // Check for anime keywords
              const hasAnimeKeyword = detailsResponse.data.keywords?.keywords?.some(
                keyword => ['anime', 'japan animation', 'japanese animation'].includes(keyword.name.toLowerCase())
              );
              
              // Return the item with a flag indicating if it's anime
              return {
                ...item,
                is_anime: isAnimation && (isJapanese || hasAnimeKeyword)
              };
            } catch (error) {
              // If we can't get details, assume it's not anime
              return { ...item, is_anime: false };
            }
          })
        );
        
        // Filter to only keep anime results
        results = detailedResults.filter(item => item.is_anime);
      }
      
      // Animate the transition of new results
      if (resultsRef.current) {
        gsap.to(resultsRef.current, {
          opacity: 0,
          y: -10,
          duration: 0.2,
          onComplete: () => {
            setAllData(results.filter(item => item.poster_path) || []);
          }
        });
      } else {
        setAllData(results.filter(item => item.poster_path) || []);
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
  }, [query, contentType, pageNum, sortBy]); // Added sortBy dependency

  // Apply fuzzy or strict search based on setting
  useEffect(() => {
    if (!query.trim()) {
      setFilteredResults([]);
      return;
    }

    if (allData.length > 0) {
      if (strictSearch) {
        // Strict search - exact matching of terms
        const searchTerms = query.toLowerCase().split(' ');
        const results = allData.filter(item => {
          const title = (item.title || item.name || '').toLowerCase();
          const overview = (item.overview || '').toLowerCase();
          
          // Check if ALL search terms are present in title or overview
          return searchTerms.every(term => 
            title.includes(term) || overview.includes(term)
          );
        });
        
        setFilteredResults(results);
      } else {
        // Fuzzy search using Fuse.js
        const fuse = new Fuse(allData, {
          keys: ['title', 'name', 'overview'],
          threshold: 0.5,
        });
        
        const results = fuse.search(query).map((result) => result.item);
        setFilteredResults(results.length > 0 ? results : []);
      }
    } else {
      setFilteredResults([]);
    }
  }, [query, allData, strictSearch]);

  // Handle content type change with animation
  const handleContentTypeChange = (newContentType) => {
    if (contentType !== newContentType) {
      // Animate current results out
      if (resultsRef.current) {
        gsap.to(resultsRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          onComplete: () => {
            setContentType(newContentType);
            setPageNum(1);
            // Results will animate back in via useEffect when filteredResults updates
          }
        });
      } else {
        setContentType(newContentType);
        setPageNum(1);
      }
    }
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPageNum(1); // Reset to first page on sort change
  };

  // Toggle search strictness
  const toggleSearchStrictness = () => {
    setStrictSearch(!strictSearch);
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
          <div className="flex flex-col justify-center items-center gap-4 mb-4">
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
            <div className="flex flex-wrap justify-center gap-2">
              <button 
                onClick={() => handleContentTypeChange('movie')} 
                className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                  contentType === 'movie'
                    ? 'bg-yellow-500 text-gray-900' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Movies
              </button>
              <button 
                onClick={() => handleContentTypeChange('tv')} 
                className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                  contentType === 'tv'
                    ? 'bg-yellow-500 text-gray-900' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                TV Shows
              </button>
              <button 
                onClick={() => handleContentTypeChange('anime_movie')} 
                className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                  contentType === 'anime_movie'
                    ? 'bg-purple-500 text-gray-900' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Anime Movies
              </button>
              <button 
                onClick={() => handleContentTypeChange('anime_tv')} 
                className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                  contentType === 'anime_tv'
                    ? 'bg-purple-500 text-gray-900' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Anime Series
              </button>
            </div>
            
            {/* New: Search Options Controls */}
            <div className="flex flex-wrap justify-center items-center gap-4 mt-2">
              {/* Sort selector */}
              <div className="flex items-center gap-2">
                <label htmlFor="sort-select" className="text-gray-300 text-sm">Sort by:</label>
                <select 
                  id="sort-select" 
                  value={sortBy} 
                  onChange={handleSortChange}
                  className="bg-gray-700 text-white rounded-lg px-2 py-1 text-sm border-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="popularity.desc">Popularity (High to Low)</option>
                  <option value="popularity.asc">Popularity (Low to High)</option>
                  <option value="vote_average.desc">Rating (High to Low)</option>
                  <option value="vote_average.asc">Rating (Low to High)</option>
                  <option value="release_date.desc">Newest First</option>
                  <option value="release_date.asc">Oldest First</option>
                </select>
              </div>
              
              {/* Search strictness toggle */}
              <div className="flex items-center gap-2">
                <span className="text-gray-300 text-sm">Strict Search:</span>
                <button 
                  onClick={toggleSearchStrictness}
                  className={`w-10 h-5 relative rounded-full transition-colors ${strictSearch ? 'bg-green-500' : 'bg-gray-600'}`}
                >
                  <span 
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transform transition-transform ${strictSearch ? 'right-0.5' : 'left-0.5'}`}
                  ></span>
                </button>
              </div>
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
            <p className="text-gray-500 mt-2">
              Try adjusting your search terms, content type, or 
              {strictSearch && <span> try <button onClick={toggleSearchStrictness} className="text-yellow-400 underline">disabling strict search</button></span>}
            </p>
          </div>
        )}
        
        {/* Results Grid with Animation */}
        {filteredResults.length > 0 && (
          <div ref={resultsRef} className="mt-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Results for "<span className="text-yellow-400">{query}</span>"
              <span className={`ml-2 ${isAnime() ? 'text-purple-400' : 'text-yellow-400'}`}>
                ({contentType.includes('anime') ? 
                  (contentType === 'anime_movie' ? 'Anime Movies' : 'Anime Series') : 
                  (contentType === 'movie' ? 'Movies' : 'TV Shows')})
              </span>
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({filteredResults.length} results)
              </span>
              <span className="text-sm font-normal text-gray-400 ml-2">
                {strictSearch ? 'Strict search' : 'Fuzzy search'}
              </span>
            </h2>
            
            <div className="overflow-hidden w-full">
              <Card Data={filteredResults} mediaType={getMediaType()} classul="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" />
            </div>
            
            {/* Enhanced Pagination Controls */}
            {filteredResults.length > 0 && (
              <div className="flex flex-col items-center justify-center mt-8 mb-4">
                <div className="flex gap-3 items-center justify-center">
                  <button 
                    className="bg-gray-800 hover:bg-gray-700 text-yellow-300 font-medium py-2 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(1)} 
                    disabled={pageNum === 1}
                  >
                    First
                  </button>
                  <button 
                    className="bg-gray-800 hover:bg-gray-700 text-yellow-300 font-medium py-2 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(pageNum - 1)} 
                    disabled={pageNum === 1}
                  >
                    Prev
                  </button>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-white font-medium">Page {pageNum}</span>
                    <span className="text-gray-400 text-sm">of {totalPages}</span>
                  </div>
                  
                  <button 
                    className="bg-gray-800 hover:bg-gray-700 text-yellow-300 font-medium py-2 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(pageNum + 1)} 
                    disabled={pageNum >= totalPages || filteredResults.length < 20}
                  >
                    Next
                  </button>
                  <button 
                    className="bg-gray-800 hover:bg-gray-700 text-yellow-300 font-medium py-2 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(totalPages)} 
                    disabled={pageNum >= totalPages || filteredResults.length < 20}
                  >
                    Last
                  </button>
                </div>
                
                {totalPages > 1 && (
                  <p className="text-gray-400 text-sm mt-2">
                    Showing results {((pageNum - 1) * 20) + 1} - {Math.min(pageNum * 20, totalPages * 20)} 
                    of approximately {totalPages * 20}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;