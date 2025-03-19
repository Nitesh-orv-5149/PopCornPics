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
          <div ref={headerRef}>
            {/* Discover Movies/TV Shows Carousel */}
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
          </div>

          {/* Trending Movies Carousel */}
          <Carousal
            apiEndpoint="https://api.themoviedb.org/3/trending/{type}/week"
            apiKey={API_KEY}
            carouselRef={trendingCarouselRef}
            contentRef={trendingContentRef}
            params={{
              time_window: 'week'
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
        </section>
      </div>
    </main>
  )
}

export default Home