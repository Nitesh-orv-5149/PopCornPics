import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const Themebttn = ({toggle, theme}) => {
  const buttonRef = useRef(null);
  const toggleRef = useRef(null);
  
  // Add floating animation for the button
  useEffect(() => {
    const tl = gsap.timeline({repeat: -1, yoyo: true});
    tl.to(buttonRef.current, {
      y: -3,
      duration: 1.5,
      ease: "sine.inOut"
    });
    
    return () => tl.kill();
  }, []);
  
  // Add animation when theme changes
  useEffect(() => {
    if (toggleRef.current) {
      gsap.fromTo(
        toggleRef.current,
        { rotate: 0 },
        { rotate: theme === "dark" ? 180 : 0, duration: 0.6, ease: "back.out(1.7)" }
      );
    }
  }, [theme]);
  
  return (
    <div ref={buttonRef} className="transition-transform hover:scale-105 duration-300">
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          className="sr-only peer" 
          type="checkbox" 
          checked={theme === "dark"} 
          onChange={toggle} 
        />
        <div 
          ref={toggleRef}
          className="w-20 h-10 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 peer-checked:from-blue-400 peer-checked:to-indigo-500 transition-all duration-500 after:content-['☀️'] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-8 after:w-8 after:flex after:items-center after:justify-center after:transition-all after:duration-500 peer-checked:after:translate-x-10 peer-checked:after:content-['🌙'] after:shadow-md after:text-lg"
        ></div>
        <span className="ml-3 text-sm font-medium text-gray-900">Theme</span>
      </label>
    </div>
  );
};

export default Themebttn;