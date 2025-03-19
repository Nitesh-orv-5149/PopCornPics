import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

/** 🔹 Fetch the current theme for a user */
export const getUserTheme = async (uid) => {
    try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data().theme || "light"; // Default to light
        } else {
            console.log("🚫 No user found!");
            return "light";
        }
    } catch (error) {
        console.error("❌ Error fetching theme:", error);
        return "light";
    }
};

/** 🔹 Toggle theme and update Firestore */
export const toggleUserTheme = async (uid, currentTheme, setTheme) => {
    if (!uid) return;

    const newTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(newTheme); // Update UI instantly

    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, { theme: newTheme });
        console.log(`✅ Theme updated to: ${newTheme}`);
    } catch (error) {
        console.error("❌ Error updating theme:", error);
    }
};


/** 🔹 Toggle a movie's bookmark (Store only ID) */
export const toggleBookmark = async (uid, movieId, setIsBookmarked) => {
    if (!uid) return;

    try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            let bookmarks = userSnap.data().bookmarked || []; // Ensure array exists
            let updatedBookmarks;

            if (bookmarks.includes(movieId)) {
                updatedBookmarks = bookmarks.filter(id => id !== movieId); // Remove movie
            } else {
                updatedBookmarks = [...bookmarks, movieId]; // Add movie ID
            }

            await updateDoc(userRef, { bookmarked: updatedBookmarks });
            setIsBookmarked(updatedBookmarks.includes(movieId));
            console.log(`✅ Bookmark ${bookmarks.includes(movieId) ? "removed" : "added"} for movie ID: ${movieId}`);
        }
    } catch (error) {
        console.error("❌ Error updating bookmarks:", error);
    }
};

/** 🔹 Get all bookmarked movie IDs for a user */
export const getUserBookmarks = async (uid) => {
    try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data().bookmarked || []; // Default to empty array
        } else {
            console.log("🚫 No user found!");
            return [];
        }
    } catch (error) {
        console.error("❌ Error fetching bookmarks:", error);
        return [];
    }
};
