import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { App, Home, About, Contact, Profile, Signup, Signin, Search,  
        DetailsPage, GenresPage, Collections, Franchise, ByCompany, 
        Bookmarked, Similar, SearchKeywords} from "./components/exports.js";
import { AppProvider } from "./components/AppContext";
import { ApiProvider } from "./ApiContext.jsx";
import { AuthProvider, useAuth } from "./AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { User, Loading } = useAuth();

  if (Loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  return User ? children : <Navigate to="/signin" replace />;
};

const router = createBrowserRouter([
  { path: '/signup', element: <Signup /> },
  { path: '/signin', element: <Signin /> },
  { path: '/', element: <ProtectedRoute><App /></ProtectedRoute> }, 
  { path: '/home', element: <ProtectedRoute><Home /></ProtectedRoute> },
  { path: '/about', element: <ProtectedRoute><About /></ProtectedRoute> },
  { path: '/contact', element: <ProtectedRoute><Contact /></ProtectedRoute> },
  { path: '/profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
  { path: '/search', element: <ProtectedRoute><Search /></ProtectedRoute> },
  { path: '/:type/details/:id', element: <ProtectedRoute><DetailsPage /></ProtectedRoute> },
  { path: '/genrespage', element: <ProtectedRoute><GenresPage /></ProtectedRoute> },
  { path: '/collections', element: <ProtectedRoute><Collections /></ProtectedRoute> },
  { path: 'franchise/:franchisename/:id', element: <ProtectedRoute><Franchise /></ProtectedRoute> },
  { path: ':company/:id', element: <ProtectedRoute><ByCompany /></ProtectedRoute> },
  { path: '/bookmarked', element: <ProtectedRoute><Bookmarked /></ProtectedRoute> },
  { path: '/similar/:id', element: <ProtectedRoute><Similar /></ProtectedRoute> },
  { path: '/searchbykeywords', element: <ProtectedRoute><SearchKeywords /></ProtectedRoute> },
]);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <AppProvider>
      <ApiProvider>
        <StrictMode>
          <RouterProvider router={router} />
        </StrictMode>
      </ApiProvider>
    </AppProvider>
  </AuthProvider>
);
