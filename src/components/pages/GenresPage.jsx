import axios from 'axios'
import React, { useEffect, useState, useContext } from 'react'
import { ApiContext } from '../../ApiContext'
import { Card } from '../../components/exports';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

// Register ScrollToPlugin
gsap.registerPlugin(ScrollToPlugin);

const GenresPage = () => {
    const API_KEY = useContext(ApiContext).API_KEY;

    const [Genres, setGenres] = useState([]);
    const [SelectedGenres, setSelectedGenres] = useState([]);
    const [Results, setResults] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [type, settype] = useState('movie');

    const fetchGenres = async () => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/genre/${type}/list`, {
                params: {
                  api_key: API_KEY,
                  language: "en",
                },
              }
            )
            setGenres(response.data || [])
        } catch (error) {
            console.log(error)
        }
    }

    const fetchResults = async () => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/discover/${type}`, {
                params: {
                  include_adult: false,
                  api_key: API_KEY,
                  sort_by: "popularity.desc" ,
                  language: "en",
                  with_genres: SelectedGenres.join(","),
                  page: pageNum,
                },
              }
            )
            const filteredResults = response.data.results.filter(
                item => item.poster_path 
            );
            setResults(filteredResults);
        } catch (error) {
            console.log(error)
        }
    }   

    useEffect(() => {
        fetchGenres();
    }, [type])    
    
    useEffect(() => {
        if (SelectedGenres.length > 0) {
            fetchResults();
        } else {
            setResults([]);
        }
    }, [SelectedGenres, pageNum, type])

    // handle genres
    const toggleGenre = (genreId) => {
        setSelectedGenres((prevSelectedGenres) => 
            prevSelectedGenres.includes(genreId) 
                ? prevSelectedGenres.filter((id) => id !== genreId) 
                : [...prevSelectedGenres, genreId]
        )    
    };

    // Scroll to top when page changes
    const handlePageChange = (newPage) => {
        // Simple scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setPageNum(newPage);
    };

    const genreVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-gray-800 rounded-xl shadow-lg lg:p-6 p-2 mb-8">
                    <h2 className="font-extrabold text-lg lg:text-2xl text-center text-white"><span className='text-yellow-400 '>SELECT</span> THE GENRES</h2>
                    <p className='mt-3 text-center text-gray-400 text-xs lg:text-sm'>click on a genre again to deselect</p>
                </div>

                <div className="flex justify-center items-center gap-10 ">
                    <p  className={`cursor-pointer transition-all ${type === 'movie' ? "text-yellow-500" : "hover:text-yellow-500"}`}
                        onClick={() => settype('movie')}>
                        movies
                    </p>
                    <p className={`cursor-pointer transition-all ${type === 'tv' ? "text-yellow-500" : "hover:text-yellow-500"}`}
                        onClick={() => settype('tv')}>
                        tvshows
                    </p>
                </div>
            
                <motion.ul 
                    className='pt-4 overflow-x-scroll overflow-y-hidden flex flex-row gap-4 justify-start'
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.05 } } // Stagger effect
                    }}
                >
                    {Genres.genres?.map((genre) => (
                        <motion.button 
                            className={`p-2 w-fit rounded-3xl cursor-pointer transition-all duration-300 ${
                                SelectedGenres.includes(genre.id) 
                                    ? "hover:bg-yellow-600 bg-yellow-500 text-gray-900" 
                                    : "hover:bg-gray-600 bg-gray-700 text-gray-300"
                            }`} 
                            key={genre.id} 
                            onClick={() => toggleGenre(genre.id)}
                            variants={genreVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        > 
                            <li className='text-xs md:text-sm'>{genre.name}</li>
                        </motion.button>
                    ))}
                </motion.ul>
                
                {Results.length > 0 && 
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="mt-6"
                    >
                        <div className="overflow-hidden w-full">
                            <Card Data={Results} mediaType={type} classul="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" />
                        </div>

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
                                disabled={Results.length < 20}
                            >
                                Next
                            </button>
                        </motion.section>
                    </motion.div>
                }
            </div>
        </div>
    )
}

export default GenresPage