import React, { useEffect, useRef, useContext } from 'react'
import { AppContext } from '../AppContext'
import { ApiContext } from '../../ApiContext'
import gsap from 'gsap'
import Carousal from '../../assets/card/Carousal'

const Home = () => {
  const API_KEY = useContext(ApiContext).API_KEY
  const { theme } = useContext(AppContext)
  
  const headerRef = useRef(null)
  const discoverContentRef = useRef(null)
  const discoverCarouselRef = useRef(null)
  const trendingContentRef = useRef(null)
  const trendingCarouselRef = useRef(null)

  useEffect(() => {
    // Initial animations
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    )
  }, [])

  return (
    <main className={`min-h-screen ${theme === "dark" ? "bg-gradient-to-b from-gray-900 to-black text-white" : "bg-gradient-to-b from-white to-gray-100 text-gray-800"} transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className='flex flex-col gap-10'>
          {/* <div ref={headerRef}>
            Discover Movies/TV Shows Carousel 
            <Carousal
              apiEndpoint="https://api.themoviedb.org/3/discover/{type}"
              apiKey={API_KEY}
              carouselRef={discoverCarouselRef}
              contentRef={discoverContentRef}
              initialType="movie"
              params={{
                include_video: false,
                sort_by: "popularity.desc"
              }}
              theme={theme}
              title="Movies" // This will be dynamically changed by the component
              titleHighlight="Discover"
              showTypeSelector={true}
              onTypeChange={(newType) => {
                // Reset page or handle any Home-level state changes if needed
                console.log(`Type changed to: ${newType}`);
              }}
            />
          </div> */}

          {/* top rated Movies Carousel */}
          <Carousal
            apiEndpoint="https://api.themoviedb.org/3/movie/top_rated"
            apiKey={API_KEY}
            carouselRef={trendingCarouselRef}
            contentRef={trendingContentRef}
            params={{
              time_window: 'week',
              without_genres: 16, // Exclude Animation (Anime)
              without_keywords: "210024", // Exclude Anime using keyword
            }}
            theme={theme}
            title="movies"
            titleHighlight="Top Rated"
            showTypeSelector={false}
            onTypeChange={(newType) => {
              // Reset page or handle any Home-level state changes if needed
              console.log(`Type changed to: ${newType}`);
            }}
            
          />

          {/* Trending series Carousel */}
          <Carousal
            apiEndpoint="https://api.themoviedb.org/3/tv/top_rated"
            apiKey={API_KEY}
            carouselRef={trendingCarouselRef}
            contentRef={trendingContentRef}
            params={{
              time_window: 'week',
              without_genres: 16, // Exclude Animation (Anime)
              without_keywords: "210024", // Exclude Anime using keyword
            }}
            theme={theme}
            title="tv shows"
            titleHighlight="popular" 
            showTypeSelector={false}
            onTypeChange={(newType) => {
              // Reset page or handle any Home-level state changes if needed
              console.log(`Type changed to: ${newType}`);
            }}  
            initialType="tv"  
          />

          {/* Curated Anime Carousel */}
          <Carousal
            apiEndpoint="https://api.themoviedb.org/3/discover/tv"
            apiKey={API_KEY}
            carouselRef={trendingCarouselRef}
            contentRef={trendingContentRef}
            params={{
              with_genres: 16,
              origin_country: "JP",
              with_keywords: "210024",
              language: "en-US",
              sort_by: "popularity.desc"
            }}
            theme={theme}
            title="Anime"
            titleHighlight="Curated Anime"
            showTypeSelector={false}
            initialType="tv"
          />


          {/* Trending Movies Carousel */}
          <Carousal
            apiEndpoint="https://api.themoviedb.org/3/trending/{type}/week"
            apiKey={API_KEY}
            carouselRef={trendingCarouselRef}
            contentRef={trendingContentRef}
            params={{
              time_window: 'week',
              without_genres: 16, // Exclude Animation (Anime)
              without_keywords: "210024", // Exclude Anime using keyword
            }}
            theme={theme}
            title="mov"
            titleHighlight="Trending"
            showTypeSelector={true}
            onTypeChange={(newType) => {
              // Reset page or handle any Home-level state changes if needed
              console.log(`Type changed to: ${newType}`);
            }}
          />

          {/* Airing Movies Carousel */}
          <Carousal
            apiEndpoint="https://api.themoviedb.org/3/movie/now_playing"
            apiKey={API_KEY}
            carouselRef={trendingCarouselRef}
            contentRef={trendingContentRef}
            params={{
              time_window: 'week',
              without_genres: 16, // Exclude Animation (Anime)
              without_keywords: "210024", // Exclude Anime using keyword
            }}
            theme={theme}
            title="movies"
            titleHighlight="Currently Airing"
            showTypeSelector={false}
            onTypeChange={(newType) => {
            }}
          />

          {/* Top Rated Anime Carousel */}
          <Carousal
            apiEndpoint="https://api.themoviedb.org/3/discover/tv"
            apiKey={API_KEY}
            carouselRef={trendingCarouselRef}
            contentRef={trendingContentRef}
            params={{
              with_genres: 16, // Animation Genre
              origin_country: "JP", // Japan
              with_keywords: "210024",
              sort_by: "vote_average.desc",
              "vote_count.gte": 100 // Ensure good ratings with a minimum vote count
            }}
            theme={theme}
            title="Anime"
            titleHighlight="Top Rated"
            showTypeSelector={false}
            initialType="tv"
          />


          {/* Airing TV Shows Carousel */}
          <Carousal
            apiEndpoint="https://api.themoviedb.org/3/tv/airing_today"
            apiKey={API_KEY}
            carouselRef={trendingCarouselRef}
            contentRef={trendingContentRef}
            params={{
              time_window: 'week',
              without_genres: 16, // Exclude Animation (Anime)
              without_keywords: "210024", // Exclude Anime using keyword
            }}
            theme={theme}
            title="tv shows"
            titleHighlight="Currently Airing"
            showTypeSelector={false}
            onTypeChange={(newType) => {
            }}
            initialType="tv"
          />

          {/* Popular Anime Carousel */}
          <Carousal
            apiEndpoint="https://api.themoviedb.org/3/discover/tv"
            apiKey={API_KEY}
            carouselRef={trendingCarouselRef}
            contentRef={trendingContentRef}
            params={{
              with_genres: 16, // Animation Genre (Anime)
              origin_country: "JP", // Japan
              sort_by: "popularity.desc", // Sort by Popularity
                       "vote_average.gte": 7.5, // Minimum rating of 7.5
                       "vote_count.gte": 100, // Minimum 100 votes to ensure quality
              with_keywords: "210024",
            }}
            theme={theme}
            title="Anime"
            titleHighlight="Popular"
            showTypeSelector={false}
            initialType='tv'
          />

        </section>
      </div>
    </main>
  )
}

export default Home