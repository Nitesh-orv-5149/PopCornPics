import React, { useState, useEffect, useRef } from "react";
import { signup, signupWithGoogle } from "../../auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { motion } from "framer-motion";
import gsap from "gsap";

const Signup = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const formRef = useRef(null);
    
    // Animation setup
    useEffect(() => {
        if (formRef.current) {
            gsap.fromTo(
                formRef.current.children,
                { 
                    opacity: 0, 
                    y: 20 
                },
                { 
                    opacity: 1, 
                    y: 0, 
                    stagger: 0.1, 
                    duration: 0.5,
                    ease: "power3.out"
                }
            );
        }
    }, []);

    // Redirect logged-in users to home after Firebase finishes loading
    useEffect(() => {
        if (!loading && user) {
            navigate("/", { replace: true });
        }
    }, [user, loading, navigate]);

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        
        try {
            await signup(email, password);
            alert("✅ Verification email sent! Please verify before logging in.");
            setIsSubmitting(false);
            
            // Success animation
            gsap.to(formRef.current, {
                opacity: 0,
                y: -20,
                duration: 0.5,
                onComplete: () => {
                    navigate("/");
                }
            });
            
        } catch (error) {
            setError(error.message);
            
            // Error animation
            gsap.fromTo(
                formRef.current, 
                { x: -10 },
                { x: 10, duration: 0.1, repeat: 5, yoyo: true }
            );
            
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignup = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        
        try {
            await signupWithGoogle();
            
            // Success animation
            gsap.to(formRef.current, {
                opacity: 0,
                y: -20,
                duration: 0.5,
                onComplete: () => {
                    navigate("/");
                }
            });
            
        } catch (error) {
            setError(error.message);
            
            // Error animation
            gsap.fromTo(
                formRef.current, 
                { x: -10 },
                { x: 10, duration: 0.1, repeat: 5, yoyo: true }
            );
            
            setIsSubmitting(false);
        }
    };

    // Show loading state before rendering
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black text-white">
                <motion.div
                    animate={{ 
                        rotate: 360,
                        transition: { duration: 1, repeat: Infinity, ease: "linear" }
                    }}
                >
                    <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full"></div>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.main 
            className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-black text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <motion.div
                className="bg-black bg-opacity-50 p-8 rounded-2xl w-full max-w-md backdrop-blur-sm"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <motion.h1 
                    className="text-4xl font-extrabold text-center mb-2"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="text-yellow-400">SIGN</span> UP
                </motion.h1>
                
                <div className="flex flex-col items-center text-center mb-6">
                    <p className="text-gray-400">Already have an account?</p>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to={'/signin'}>
                            <p className="text-yellow-400 hover:underline font-medium">Sign in instead</p>
                        </Link>
                    </motion.div>
                </div>
                
                {error && (
                    <motion.div 
                        className="bg-red-900/40 text-red-200 p-3 rounded-lg mb-6 text-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {error}
                    </motion.div>
                )}
                
                <form ref={formRef} className="flex flex-col gap-5" onSubmit={handleSignup}>
                    <div className="relative">
                        <motion.input 
                            className="w-full bg-gray-800/60 border border-gray-700 p-4 pl-10 rounded-4xl focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all duration-300"
                            type="email" 
                            placeholder="Email"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            whileFocus={{ scale: 1.01 }}
                            required 
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <i className="fa-solid fa-envelope"></i>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <motion.input 
                            className="w-full bg-gray-800/60 border border-gray-700 p-4 pl-10 rounded-4xl focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all duration-300"
                            type="password" 
                            placeholder="Password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            whileFocus={{ scale: 1.01 }}
                            required 
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <i className="fa-solid fa-lock"></i>
                        </div>
                    </div>
                    
                    <p className="mt-4">or</p>
                    <button onClick={handleGoogleSignup} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center">
                        <i className="fa-brands fa-google mr-2"></i> Sign up with Google
                    </button>

                    <motion.button 
                        className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-4 px-4 rounded-lg shadow transition-all duration-300 flex items-center justify-center"
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {isSubmitting ? (
                            <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : (
                            <i className="fa-solid fa-user-plus mr-2"></i>
                        )}
                        Create Account
                    </motion.button>
                </form>
            </motion.div>
        </motion.main>
    );
};

export default Signup;