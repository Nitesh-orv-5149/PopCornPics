import React, { useState, useEffect, useContext } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Card } from '../exports';
import { ApiContext } from '../../ApiContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Bookmarked = () => {
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = useContext(ApiContext).API_KEY;
  const [bookmarkedMovies, setBookmarkedMovies] = useState([]);
  const [bookmarkedTVShows, setBookmarkedTVShows] = useState([]);
  const [activeType, setActiveType] = useState('movie');
  const auth = getAuth();

  // First fetch bookmarked IDs with their content type
  useEffect(() => {
    const fetchBookmarkedItems = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          console.log("No user logged in");
          setLoading(false);
          return;
        }

        console.log("Current user:", user.uid);
        
        // Try getting the user document with bookmarked array
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        // Store array of objects with ID and content type
        let bookmarks = [];
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.bookmarked && Array.isArray(userData.bookmarked)) {
            console.log("Found bookmarks in user document:", userData.bookmarked);
            
            // If bookmarks are stored with content type info
            if (typeof userData.bookmarked[0] === 'object' && userData.bookmarked[0].id) {
              bookmarks = userData.bookmarked;
            } else {
              // If bookmarks are just array of IDs, we'll need to determine type later
              bookmarks = userData.bookmarked.map(id => ({ id }));
            }
            
            setBookmarkedItems(bookmarks);
          } else {
            console.log("User document exists but no bookmarked array found");
          }
        } else {
          console.log("User document does not exist");
          
          // Fallback: Query the 'bookmarked' collection
          const bookmarksRef = collection(db, 'bookmarked');
          const q = query(bookmarksRef, where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          
          if (querySnapshot.size > 0) {
            console.log("Found documents in bookmarked collection");
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              if (data.bookmarked && Array.isArray(data.bookmarked)) {
                console.log("Found bookmarked array:", data.bookmarked);
                
                // Handle same type detection logic
                if (typeof data.bookmarked[0] === 'object' && data.bookmarked[0].id) {
                  bookmarks = data.bookmarked;
                } else {
                  bookmarks = data.bookmarked.map(id => ({ id }));
                }
                
                setBookmarkedItems(bookmarks);
              }
            });
          } else {
            console.log("No documents found in bookmarked collection");
          }
        }
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        setError(error.message);
      }
    };

    fetchBookmarkedItems();
  }, []);

  // Then fetch details for each bookmarked item and separate movies & TV shows
  useEffect(() => {
    const fetchBookmarkedDetails = async () => {
      if (bookmarkedItems.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const movies = [];
        const tvShows = [];
        
        // Function to check media type with multi search
        const checkMediaType = async (id) => {
          try {
            // Use the search endpoint to determine correct type
            const searchResponse = await axios.get(`https://api.themoviedb.org/3/search/multi`, {
              params: {
                api_key: API_KEY,
                language: "en",
                query: id, // Use ID as query to try finding exact matches
                include_adult: false
              }
            });
            
            // Look for exact ID match in results
            const exactMatch = searchResponse.data.results.find(
              item => item.id.toString() === id.toString()
            );
            
            if (exactMatch) {
              return exactMatch.media_type; // 'movie', 'tv', or 'person'
            }
            
            return null; // No match found
          } catch (error) {
            console.error(`Error in multi search for ID ${id}:`, error);
            return null;
          }
        };
        
        // Fetch details for each bookmarked ID
        for (const item of bookmarkedItems) {
          const id = typeof item === 'object' ? item.id : item;
          let contentType = typeof item === 'object' ? item.type : null;
          
          // If we don't know the type, try to determine it
          if (!contentType) {
            contentType = await checkMediaType(id);
          }
          
          if (contentType === 'movie' || !contentType) {
            // Try as movie (or default to movie if type detection failed)
            try {
              const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
                params: {
                  api_key: API_KEY,
                  language: "en"
                }
              });
              movieResponse.data.media_type = 'movie';
              movies.push(movieResponse.data);
              continue; // Skip to next item
            } catch (movieError) {
              console.log(`ID ${id} is not a valid movie, will try as TV...`);
            }
          }
          
          if (contentType === 'tv' || !contentType) {
            // Try as TV show if it wasn't a movie
            try {
              const tvResponse = await axios.get(`https://api.themoviedb.org/3/tv/${id}`, {
                params: {
                  api_key: API_KEY,
                  language: "en"
                }
              });
              tvResponse.data.media_type = 'tv';
              tvShows.push(tvResponse.data);
            } catch (tvError) {
              console.error(`Error: ID ${id} could not be retrieved as TV show either`);
            }
          }
        }
        
        console.log(`Found ${movies.length} movies and ${tvShows.length} TV shows`);
        setBookmarkedMovies(movies);
        setBookmarkedTVShows(tvShows);
      } catch (error) {
        console.error('Error fetching bookmarked details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (bookmarkedItems.length > 0) {
      fetchBookmarkedDetails();
    } else {
      setLoading(false);
    }
  }, [bookmarkedItems, API_KEY]);

  const handleTypeChange = (type) => {
    setActiveType(type);
  };

  // Get current data based on filter
  const currentData = activeType === 'movie' ? bookmarkedMovies : bookmarkedTVShows;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: { 
        staggerChildren: 0.05,
        staggerDirection: -1 
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { type: "spring", stiffness: 400 } },
    tap: { scale: 0.98 }
  };

  const loadingVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        repeat: Infinity,
        duration: 1.5
      }
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        type: "tween"
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: {
        duration: 0.3
      }
    })
  };

  const [slideDirection, setSlideDirection] = useState(0);

  const switchTab = (type) => {
    setSlideDirection(type === 'movie' ? -1 : 1);
    setTimeout(() => handleTypeChange(type), 50);
  };

  return (
    <motion.div 
      className="bookmarks-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-2xl font-bold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        Bookmarked Items
      </motion.h1>
      
      {/* Type selector with animated buttons */}
      <motion.div 
        className="flex space-x-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <motion.button 
          onClick={() => switchTab('movie')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeType === 'movie' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial="initial"
        >
          <motion.span 
            className="flex items-center"
            animate={{ x: activeType === 'movie' ? 0 : 0 }}
          >
            Movies ({bookmarkedMovies.length})
            {activeType === 'movie' && (
              <motion.div 
                className="ml-2 w-2 h-2 rounded-full bg-white"
                layoutId="activeIndicator" 
              />
            )}
          </motion.span>
        </motion.button>
        <motion.button 
          onClick={() => switchTab('tv')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeType === 'tv' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial="initial"
        >
          <motion.span 
            className="flex items-center"
            animate={{ x: activeType === 'tv' ? 0 : 0 }}
          >
            TV Shows ({bookmarkedTVShows.length}) 
            {activeType === 'tv' && (
              <motion.div 
                className="ml-2 w-2 h-2 rounded-full bg-white"
                layoutId="activeIndicator" 
              />
            )}
          </motion.span>
        </motion.button>
      </motion.div>
      
      <AnimatePresence mode="wait" custom={slideDirection}>
        {loading ? (
          <motion.div 
            key="loading"
            className="flex justify-center items-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.p 
              className="text-lg flex items-center"
              variants={loadingVariants}
              animate="animate"
            >
              <motion.span 
                className="inline-block w-4 h-4 mr-3 bg-blue-600 rounded-full"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "easeInOut"
                }}
              />
              Loading your bookmarked items...
            </motion.p>
          </motion.div>
        ) : error ? (
          <motion.div 
            key="error"
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <p>Error: {error}</p>
          </motion.div>
        ) : currentData.length > 0 ? (
          <motion.div
            key={activeType}
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
          >
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="w-full"
            >
              <Card 
                Data={currentData} 
                mediaType={activeType} 
                classul="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" 
                framerMotion={true} 
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <motion.p 
              className="text-lg text-gray-600"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {activeType === 'movie' 
                ? "No bookmarked movies found." 
                : "No bookmarked TV shows found."}
              {" "}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Try bookmarking some content!
              </motion.span>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Bookmarked;