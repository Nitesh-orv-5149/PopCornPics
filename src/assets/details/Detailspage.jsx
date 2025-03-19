import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ApiContext } from '../../ApiContext'
import Reviews from './Reviews'
import { motion } from 'framer-motion'
import { useAuth } from '../../AuthContext';
import { getUserBookmarks, toggleBookmark } from "../../firestoreUtils";
// import { auth, db } from '../../firebase'
// import { doc, setDoc, getDoc } from 'firebase/firestore'

const Detailspage = () => {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const { API_KEY } = useContext(ApiContext);
  const [details, setDetails] = useState({})
  const [trailerKey, setTrailerKey] = useState(null);
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { User } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!User) return;

    const fetchBookmarks = async () => {
      const bookmarks = await getUserBookmarks(User.uid);
      setIsBookmarked(bookmarks.includes(id));
    };

    fetchBookmarks();
  }, [User, id]);

  // Check if type is valid
  const validType = type === 'movie' || type === 'tv' ? type : 'movie';

  const handleExpand = (reviewId) => {
    setExpandedReviewId(expandedReviewId === reviewId ? null : reviewId);
  };

  const fetchDetails = async () => {
    try {
      // Make API call based on the type (movie or tv)
      const response = await axios.get(`https://api.themoviedb.org/3/${validType}/${id}?append_to_response=reviews`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
        },
      });
      setDetails(response.data);

      // Fetch trailer (different endpoint for movies and TV shows)
      const videoResponse = await axios.get(`https://api.themoviedb.org/3/${validType}/${id}/videos`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
        },
      });
      const trailer = videoResponse.data.results.find((video) => 
                                    video.type === 'Trailer' && video.site === 'YouTube');
      if (trailer) {
        setTrailerKey(trailer.key);
      }
      
    } catch (error) {
      console.error(`Error fetching ${validType} details:`, error);
    }
  }

  useEffect(() => {
    // Redirect to a valid URL if the type parameter is invalid
    if (type !== 'movie' && type !== 'tv') {
      navigate(`/movie/details/${id}`, { replace: true });
      return;
    }
    
    fetchDetails();
  }, [id, type, validType, navigate]); // Add validType and navigate to dependencies

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const fadeInVariant = {
    hidden: { opacity: 0, y: 200 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Helper function to get the title (different property names for movies and TV shows)
  const getTitle = () => {
    if (validType === 'movie') {
      return details.title;
    } else {
      return details.name;
    }
  };

  // Helper function to get the release date (different property names for movies and TV shows)
  const getReleaseDate = () => {
    if (validType === 'movie') {
      return details.release_date;
    } else {
      return details.first_air_date;
    }
  };

  

  return (
    <>
      <main className='fade-in min-h-screen relative text-white'>
        {/* Backdrop image as background */}
        {details.backdrop_path && (
          <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
            <img className='w-full h-full object-cover opacity-30'
                 src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
                 alt=""
                 draggable='false' />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        )}

        {/* Content container */}
        <div className='flex flex-col items-center justify-start p-6 z-10 relative max-w-6xl mx-auto'>
          {/* Header with title and basic info */}
          <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            className="w-full text-center mb-8">
            <h1 className='uppercase text-3xl md:text-[4rem] font-extrabold mb-2'>{getTitle()}</h1>
            {details.tagline && <p className="text-blue-400 italic mb-4">"{details.tagline}"</p>}
            
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {getReleaseDate() && (
                <div className="px-3 py-1 bg-gray-800/50 backdrop-blur-sm rounded-full">
                  📅 {getReleaseDate()?.split('-').reverse().join('-')}
                </div>
              )}
              {details.runtime && validType === 'movie' && (
                <div className="px-3 py-1 bg-gray-800/50 backdrop-blur-sm rounded-full">
                  ⏱️ {details.runtime} mins
                </div>
              )}
              {details.episode_run_time && details.episode_run_time.length > 0 && validType === 'tv' && (
                <div className="px-3 py-1 bg-gray-800/50 backdrop-blur-sm rounded-full">
                  ⏱️ {details.episode_run_time[0]} mins/episode
                </div>
              )}
              {details.vote_average && (
                <div className="px-3 py-1 bg-gray-800/50 backdrop-blur-sm rounded-full">
                  ⭐ {details.vote_average.toFixed(1)}/10 ({details.vote_count} votes)
                </div>
              )}
              {details.status && (
                <div className="px-3 py-1 bg-gray-800/50 backdrop-blur-sm rounded-full">
                  {details.status}
                </div>
              )}
              {validType === 'tv' && details.number_of_seasons && (
                <div className="px-3 py-1 bg-gray-800/50 backdrop-blur-sm rounded-full">
                  {details.number_of_seasons} Season{details.number_of_seasons !== 1 ? 's' : ''}
                </div>
              )}
              {/* 🔹 Bookmark Button (Stores only Movie ID) */}
              {User && (
                  <button onClick={() => toggleBookmark(User.uid, id, setIsBookmarked)}>
                    <i className={`fa-regular fa-bookmark text-2xl ${isBookmarked ? "bg-yellow-500" : ""}`}></i>
                  </button>
                )}

            </div>
          </motion.div>

          {/* Media content container - horizontal on md+ screens */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between w-full gap-8 mb-8">
            {/* Poster */}
            {details.poster_path && (
              <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                                          className="md:w-1/3 flex-shrink-0">
                <div className="sticky w-full top-6">
                  <img className='rounded-lg w-full shadow-lg'
                      src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                      alt={getTitle()}
                      draggable='false' />
                </div>
              </motion.div>
            )}

            {/* Main content column */}
            <div className="md:w-3/4">
              {/* Overview */}
              <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                           className="mb-8">
                <h2 className="text-xl font-bold mb-3">Overview</h2>
                <p className="text-gray-200">{details.overview}</p>
              </motion.div>

              {/* Genres */}
              {details.genres && details.genres.length > 0 && (
                <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                                            className="mb-8">
                  <h2 className="text-xl font-bold mb-3">Genres</h2>
                  <div className="flex flex-wrap gap-2">
                    {details.genres.map((genre) => (
                      <span key={genre.id} className="px-3 py-1 bg-blue-900/50 rounded-full text-sm">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TV show specific data */}
              {validType === 'tv' && details.created_by && details.created_by.length > 0 && (
                <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                                              className="mb-8">
                  <h2 className="text-xl font-bold mb-3">Created By</h2>
                  <div className="flex flex-wrap gap-2">
                    {details.created_by.map((creator) => (
                      <span key={creator.id} className="px-3 py-1 bg-blue-900/50 rounded-full text-sm">
                        {creator.name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Trailer */}
              {trailerKey && (
                <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                                        className="mb-8">
                  <h2 className="text-xl font-bold mb-3">Trailer</h2>
                  <div className="aspect-video">
                    <iframe className='rounded-lg w-full h-full'
                      title='trailer'
                      src={`https://www.youtube-nocookie.com/embed/${trailerKey}`}
                      frameBorder='0'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                      allowFullScreen
                    />
                  </div>
                </motion.div>
              )}

              {/* Production details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Financial info */}
                <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                             className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-lg">
                  <h2 className="text-lg font-bold mb-3">Production Info</h2>
                  <div className="space-y-2">
                    {validType === 'movie' && (
                      <>
                        <p><span className="text-gray-400">Budget:</span> {formatCurrency(details.budget)}</p>
                        <p><span className="text-gray-400">Revenue:</span> {formatCurrency(details.revenue)}</p>
                      </>
                    )}
                    {validType === 'tv' && (
                      <>
                        <p><span className="text-gray-400">Episodes:</span> {details.number_of_episodes || 'N/A'}</p>
                        <p><span className="text-gray-400">Seasons:</span> {details.number_of_seasons || 'N/A'}</p>
                        <p><span className="text-gray-400">Last Air Date:</span> {details.last_air_date || 'N/A'}</p>
                      </>
                    )}
                    <p><span className="text-gray-400">Language:</span> {details.original_language?.toUpperCase()}</p>
                    <p><span className="text-gray-400">Popularity:</span> {details.popularity}</p>
                    {details.homepage && (
                      <p>
                        <span className="text-gray-400">Homepage:</span>{' '}
                        <a href={details.homepage} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          Visit
                        </a>
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* Production companies */}
                {details.production_companies && details.production_companies.length > 0 && (
                  <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                                                className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-lg">
                    <h2 className="text-lg font-bold mb-3">Production Companies</h2>
                    <ul className="space-y-1">
                      {details.production_companies.map((company) => (
                        <li key={company.id}>{company.name}</li>
                      ))}
                    </ul>
                    {validType === 'movie' && details.belongs_to_collection && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <p><span className="text-gray-400">Collection:</span> {details.belongs_to_collection.name}</p>
                      </div>
                    )}
                    {validType === 'tv' && details.networks && details.networks.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <h3 className="text-md font-bold mb-2">Networks</h3>
                        <ul className="space-y-1">
                          {details.networks.map((network) => (
                            <li key={network.id}>{network.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                                   className="w-full mb-8">
            <h2 className="text-2xl font-bold mb-4">User Reviews</h2>
            <div className='overflow-x-scroll '>
              {details.reviews?.results?.length > 0 ? (
                <div className="flex space-x-4 min-w-800 max-w-800 gap-5 overflow-x-auto pb-4 -mx-2 px-2">
                  {details.reviews.results.map(review => (
                    <Reviews key={review.id} review={review} />
                  ))}
                </div>
                
              ) : (
                <p className="text-center w-full py-8 text-gray-400 bg-gray-800/50 backdrop-blur-sm rounded-lg">No reviews available</p>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </>
  )
}

export default Detailspage