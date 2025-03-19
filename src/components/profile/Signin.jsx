import React, { useState, useEffect, useRef } from "react";
import { signin, resendVerificationEmail } from "../../auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { motion } from "framer-motion";
import gsap from "gsap";
import { signinWithGoogle } from "../../auth";
import { auth } from "../../firebase";


const Signin = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [unverifiedUser, setUnverifiedUser] = useState(null);
    
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

    // Wait for Firebase to finish loading before checking user state
    useEffect(() => {
        if (!loading && user) {
            navigate("/", { replace: true });
        } else {
            setUnverifiedUser(auth.currentUser); // Store user for resending verification email
        }
    }, [user, loading, navigate]);

    const handleSignin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        
        try {
            await signin(email, password);
            
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

    const handleResendEmail = async () => {
        if (unverifiedUser) {
            await resendVerificationEmail(unverifiedUser);
        }
    };

    const handleGoogleSignin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        
        try {
            const user = await signinWithGoogle();

            if (user) {
                // ✅ Redirect only if user exists in Firestore
                gsap.to(formRef.current, {
                    opacity: 0,
                    y: -20,
                    duration: 0.5,
                    onComplete: () => {
                        navigate("/");
                    }
                });
            } else {
                setIsSubmitting(false); // ✅ Prevents redirect & re-enables button
            }
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
                    <span className="text-yellow-400">SIGN</span> IN
                </motion.h1>
                
                <div className="flex flex-col items-center text-center mb-6">
                    <p className="text-gray-400">Don't have an account?</p>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to={'/signup'}>
                            <p className="text-yellow-400 hover:underline font-medium">Create an account</p>
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
                
                <form ref={formRef} className="flex flex-col gap-5" onSubmit={handleSignin}>
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

                    {/* 🔹 Google Sign-In Button */}
                    <button 
                        onClick={handleGoogleSignin}
                        className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
                    >
                        <i className="fa-brands fa-google mr-2"></i>
                        Sign in with Google
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
                            <i className="fa-solid fa-right-to-bracket mr-2"></i>
                        )}
                        Sign In
                    </motion.button>

                    {/* 🔹 Redirect to Sign-Up Page */}
                    <p className="mt-4">
                        Don't have an account? 
                        <a href="/signup" className="text-blue-400 hover:text-blue-600"> Sign up</a>
                    </p>

                    {unverifiedUser && (
                        <button onClick={handleResendEmail} className="mt-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                            Resend Verification Email
                        </button>
                    )}
                </form>
            </motion.div>
        </motion.main>
    );
};

export default Signin;