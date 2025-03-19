import { auth, db } from "./firebase"; // Import Firestore
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,  deleteUser, reauthenticateWithCredential, EmailAuthProvider, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, deleteDoc, collection, getDocs, updateDoc, getDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// 🔹 Function to add user to Firestore
const addUserToFirestore = async (user) => {
    if (!user) return;

    try {

        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            name: user.displayName || "Anonymous",
            createdAt: new Date(),
            theme: "dark",
            bookmarked: [],
            subscription: "basic",
            verified: 'false'
        }, { merge: true }); // Merge prevents overwriting existing data

        console.log("✅ User added to Firestore & verification email sent!");
    } catch (error) {
        console.error("❌ Error adding user to Firestore:", error);
    }
};

/** 🔹 Sign-Up with Google */
export const signupWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // 🔹 Check if user already exists
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // 🔹 Add new user to Firestore
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                createdAt: new Date(),
                theme: "light",
                bookmarked: [] // Default empty bookmarks
            });
            await addUserToFirestore(user); 
            console.log("✅ New Google user signed up!");
        }

        return user;
    } catch (error) {
        console.error("❌ Google Sign-Up error:", error);
        throw error;
    }
};

//** 🔹 Google Sign-In (Only for Existing Users) */
export const signinWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // 🔹 Check if user exists in Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        

        if (!userSnap.exists()) {
            alert("❌ No account found for this Google user. Please sign up first.");
            return null; // Stop sign-in process
        }

        console.log("✅ Google user signed in:", user.email);
        return user;
    } catch (error) {
        console.error("❌ Google Sign-In error:", error);

        if (error.code === "auth/popup-closed-by-user") {
            alert("Google sign-in was canceled. Please try again.");
        } else if (error.code === "auth/network-request-failed") {
            alert("Network error. Check your internet connection.");
        } else {
            alert("Google Sign-In failed. Please try again.");
        }

        return null; // Stop sign-in process
    }
};

// 🔹 Function to add a new field to all users (run once)
export const addNewFieldToAllUsers = async (newField, defaultValue) => {
    try {
        const usersRef = collection(db, "users"); // Reference the users collection
        const usersSnapshot = await getDocs(usersRef);

        usersSnapshot.forEach(async (userDoc) => {
            const userRef = doc(db, "users", userDoc.id);

            // Check if the field already exists
            if (!(newField in userDoc.data())) {
                await updateDoc(userRef, { [newField]: defaultValue }); // 🔥 Add new field
                console.log(`✅ Added "${newField}" to user: ${userDoc.id}`);
            }
        });

        console.log(`🚀 All existing users updated with "${newField}"!`);
    } catch (error) {
        console.error("❌ Error updating users:", error);
    }
};


// 🔹 Signup Function (Modified)
export const signup = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 🔹 Send verification email before adding to Firestore
        await sendEmailVerification(user);
        alert("✅ Verification email sent! Please check your inbox before logging in.");

        await addUserToFirestore(user); // Add user to Firestore after signup
        return user;
    } catch (error) {
        console.error('❌ Signup error:', error.message);
        throw error;
    }
};

// 🔹 Signin Function
export const signin = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
            alert("❌ Email not verified! Please check your inbox.");
            return null;
        }

        // 🔹 Update Firestore verification status if needed
        await checkAndUpdateVerificationStatus(user);

        console.log("✅ User signed in:", user.email);
        return user;
    } catch (error) {
        console.error('❌ Signin error:', error.message);
        throw error;
    }
};

// 🔹 Signout Function
export const signout = async () => {
    try {
        await signOut(auth);
        console.log('✅ User signed out successfully');
    } catch (error) {
        console.error('❌ Signout error:', error.message);
        throw error;
    }
};

// 🔹 Function to delete user from Authentication & Firestore
// 🔹 Function to delete user from Firebase Auth & Firestore
export const deleteUserAccount = async (password) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.log("🚫 No user is currently logged in.");
            return;
        }

        // 🔹 Step 1: Re-authenticate the user before deletion
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
        console.log("✅ User re-authenticated");

        // 🔹 Step 2: Delete the user's Firestore document
        const userRef = doc(db, "users", user.uid);
        await deleteDoc(userRef);
        console.log("✅ User deleted from Firestore");

        // 🔹 Step 3: Delete the user from Firebase Authentication
        await deleteUser(user);
        console.log("✅ User deleted from Firebase Authentication");

    } catch (error) {
        console.error("❌ Error deleting user:", error.message);
    }
};

export const resendVerificationEmail = async (user) => {
    try {
        if (!user) {
            alert("❌ No user found. Please log in first.");
            return;
        }

        await sendEmailVerification(user);
        alert("✅ Verification email sent again! Please check your inbox.");
    } catch (error) {
        console.error("❌ Error resending verification email:", error);
        alert("❌ Failed to resend email. Try again later.");
    }
};

export const checkAndUpdateVerificationStatus = async (user) => {
    if (!user) return;

    try {
        await user.reload(); // Refresh user data
        if (user.emailVerified) {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { verified: true });
            console.log("✅ Email verified & updated in Firestore!");
        }
    } catch (error) {
        console.error("❌ Error updating verification status:", error);
    }
};
