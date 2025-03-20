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


/** 🔹 Toggle a movie's bookmark (Store as object with type and id) */
export const toggleBookmark = async (uid, movieId, type, setIsBookmarked) => {
    if (!uid) return;

    try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            let bookmarks = userSnap.data().bookmarked || []; // Ensure array exists
            let updatedBookmarks;

            // Check if this movie/show is already bookmarked
            const existingBookmarkIndex = bookmarks.findIndex(
                bookmark => bookmark.id === movieId && bookmark.type === type
            );

            if (existingBookmarkIndex !== -1) {
                // Remove bookmark if exists
                updatedBookmarks = bookmarks.filter((_, index) => index !== existingBookmarkIndex);
            } else {
                // Add bookmark as object with type and id
                updatedBookmarks = [...bookmarks, { type, id: movieId }];
            }

            await updateDoc(userRef, { bookmarked: updatedBookmarks });
            
            // Update UI state
            const isNowBookmarked = updatedBookmarks.some(
                bookmark => bookmark.id === movieId && bookmark.type === type
            );
            setIsBookmarked(isNowBookmarked);
            
            console.log(`✅ Bookmark ${existingBookmarkIndex !== -1 ? "removed" : "added"} for ${type} ID: ${movieId}`);
        }
    } catch (error) {
        console.error("❌ Error updating bookmarks:", error);
    }
};

/** 🔹 Get all bookmarked items for a user */
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

/** 🔹 Check if a specific item is bookmarked */
export const isItemBookmarked = (bookmarks, id, type) => {
    if (!bookmarks || !Array.isArray(bookmarks)) return false;
    
    return bookmarks.some(bookmark => 
        bookmark.id === id && bookmark.type === type
    );
};