import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const Reviews = ({ review }) => {
    const [expanded, setExpanded] = useState(false);
    const reviewRef = useRef(null);
    const contentRef = useRef(null);
    const ratingRef = useRef(null);
    
    // Initial animation when component mounts
    useEffect(() => {
        gsap.fromTo(
            reviewRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
        );
        
        // Animate the rating stars
        gsap.fromTo(
            ratingRef.current,
            { scale: 0 },
            { scale: 1, duration: 0.4, delay: 0.3, ease: "back.out(1.7)" }
        );
    }, []);
    
    // Handle expand/collapse animation
    useEffect(() => {
        if (expanded) {
            gsap.to(contentRef.current, {
                maxHeight: "2000px",
                duration: 0.5,
                ease: "power2.out"
            });
        } else {
            gsap.to(contentRef.current, {
                maxHeight: "80px",
                duration: 0.3,
                ease: "power2.in"
            });
        }
    }, [expanded]);
    
    return (
        <div 
            ref={reviewRef}
            className="bg-slate-800 rounded-lg p-4 m-2 w-full relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20"
        >
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">{review.author}</h3>
                <div ref={ratingRef} className="flex items-center bg-gray-700 px-2 py-1 rounded-md">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">{review.author_details.rating}/10</span>
                </div>
                <div className="text-sm text-gray-400">{review.date}</div>
            </div>
            
            <div 
                ref={contentRef}
                className="text-sm overflow-hidden transition-all duration-300"
                style={{ maxHeight: expanded ? "2000px" : "80px" }}
            >
                <p>{review.content}</p>
            </div>
            
            <div 
                className={`text-center text-blue-400 hover:text-blue-300 cursor-pointer py-1 mt-2 transition-all duration-200 ${expanded ? "" : "bg-gradient-to-t from-slate-800 via-slate-800 to-transparent pt-6 -mt-6 relative"}`}
                onClick={() => {
                    // Button animation on click
                    gsap.to(contentRef.current, {
                        y: expanded ? 0 : 10,
                        yoyo: true,
                        duration: 0.2
                    });
                    setExpanded(!expanded);
                }}
            >
                {expanded ? "Show Less" : "Read More"}
            </div>
        </div>
    );
};

export default Reviews;