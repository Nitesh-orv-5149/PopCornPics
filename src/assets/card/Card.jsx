import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

const Card = ({ Data, classul, mediaType }) => {
  const listRef = useRef(null);
  
  // Use the mediaType prop, defaulting to 'movie' if not provided
  const type = mediaType || 'movie';
  
  // Initial animation when cards load
  useEffect(() => {
    if (listRef.current && listRef.current.children.length > 0) {
      gsap.fromTo(
        listRef.current.children,
        { 
          y: 30, 
          opacity: 0,
          scale: 0.95
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          stagger: 0.07,
          duration: 0.6,
          ease: "power2.out" 
        }
      );
    }
  }, [Data]);
  
  // Setup hover animations for each card
  const handleMouseEnter = (el) => {
    gsap.to(el, {
      y: -10,
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
      duration: 0.1,
      ease: "power2.out"
    });
  };
  
  const handleMouseLeave = (el) => {
    gsap.to(el, {
      y: 0,
      scale: 1,
      boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
      duration: 0.1,
      ease: "power2.in"
    });
  };

  // Check if Data is available before rendering
  if (!Data || Data.length === 0) {
    return <div className="text-center py-8 text-gray-400">No data available</div>;
  }
  
  console.log('type : ', type)

  return (
    <>
      <ul ref={listRef} className={`${classul || ''} cursor-grab`}>
        {Data.map((data) => (
          <Link to={`/${type}/details/${data.id}`} key={data.id}>
            <li 
              className="w-[200px] shrink-0 flex flex-col items-center transition-all duration-300"
              onMouseEnter={(e) => handleMouseEnter(e.currentTarget)}
              onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
            >
              <div className="relative overflow-hidden rounded-lg w-full shadow-md group">
                {data.poster_path ? (
                  <img 
                    src={`https://image.tmdb.org/t/p/w300${data.poster_path}`} 
                    alt={data.title || data.name} 
                    draggable='false' 
                    className="w-full object-cover hover:brightness-110 transition-all duration-300" 
                  />
                ) : (
                  <div className="bg-gray-800 w-full h-[300px] flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-2">
                  <div className="text-white text-sm font-bold translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    View Details
                  </div>
                </div>
              </div>
              
              <div className="w-full text-center mt-2">
                <p className="text-gray-200 hover:text-yellow-400 transition-colors duration-200 line-clamp-2">
                  {data.title || data.name}
                </p>
                {data.vote_average && (
                  <p className="text-sm text-gray-400 mt-1">
                    ⭐ {data.vote_average.toFixed(1)}
                  </p>
                )}
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </>
  );
};

export default Card;