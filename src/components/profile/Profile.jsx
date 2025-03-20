import React, { useState, useRef, useEffect } from 'react';
import Signout from '../profile/Signout';
import { gsap } from 'gsap';
import { deleteUserAccount, addNewFieldToAllUsers } from '../../auth';
import { useAuth } from '../../AuthContext';
import { getUserTheme, toggleUserTheme } from '../../firestoreUtils';

const Profile = () => {

  const { User } = useAuth(); // Get logged-in user
  const profileRef = useRef(null);
  const [theme, setTheme] = useState("dark"); // Default theme

  // 🔹 Fetch user's current theme on component mount
  useEffect(() => {
    if (User) {
      getUserTheme(User.uid).then(setTheme);
    }
  }, [User]);

  // 🔹 Toggle theme function
  const handleToggleTheme = () => {
    if (User) {
      toggleUserTheme(User.uid, theme, setTheme);
    }
  };

  const [password, setPassword] = useState("");

  const handleDelete = () => {
      deleteUserAccount(password);
  };

  useEffect(() => {
    // Profile entrance animation
    const tl = gsap.timeline();
    
    tl.fromTo(
      profileRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    );
    
    return () => tl.kill();
  }, []);
  
  return (
    <div 
      ref={profileRef} 
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4"
    >
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center mb-6">
            <span className="text-3xl">👤</span>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">User Profile</h1>
          <p className="text-gray-400 mb-8">Welcome back to PopcornPics!</p>
          
          {/* 🔹 Show User Email */}
          {User ? (
            <p className="text-white text-lg mb-6">📧 {User.email}</p>
          ) : (
            <p className="text-gray-400 text-lg mb-6">No user logged in</p>
          )}
          
          <div className="w-full flex justify-center">
            <Signout />
          </div>
          {/* <section>
            <div>
               <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleDelete}>Delete Account</button>
            </div>
          </section> */}
          {/* <section>
            <button className='bg-blue-500 text-white px-4 py-2 rounded-md' onClick={() => {
              addNewFieldToAllUsers("bookmarked", [])
            }}>
                Add "bookmarked" to All Users
            </button>
          </section>
          <p className="text-white mb-4">Current Theme: {theme}</p>
          <button
            onClick={handleToggleTheme}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Toggle Theme
          </button> */}
        </div>
      </div>
    </div>
    
    // <div 
    //   ref={profileRef} 
    //   className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4"
    // >
    //   <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-lg p-8">
    //     <div className="flex flex-col items-center">
    //       <div className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center mb-6">
    //         <span className="text-3xl">👤</span>
    //       </div>
          
    //       <h1 className="text-2xl font-bold text-white mb-2">User Profile</h1>
    //       <p className="text-gray-400 mb-8">Welcome back to PopcornPics!</p>
          
    //       <div className="w-full flex justify-center">
    //         <Signout />
    //       </div>
    //       <section>
    //         <div>
    //           <input
    //               type="password"
    //               placeholder="Enter your password"
    //               value={password}
    //               onChange={(e) => setPassword(e.target.value)}
    //             />
    //             <button onClick={handleDelete}>Delete Account</button>
    //         </div>
    //       </section>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Profile;