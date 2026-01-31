import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Load ALL data from LocalStorage
    const role = localStorage.getItem("userRole");
    const name = localStorage.getItem("userName");
    const _id = localStorage.getItem("userId"); // <--- ADD THIS
    
    if (role && _id) {
      setUser({ role, name, _id }); // <--- ADD _id HERE
    }
  }, []);

  const login = (userData) => {
    // userData comes from the Login API response
    setUser(userData);
    localStorage.setItem("userRole", userData.role);
    localStorage.setItem("userName", userData.name);
    localStorage.setItem("userId", userData._id); // <--- SAVE IT
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// // src/context/AuthContext.jsx

// import { createContext, useContext, useState, useEffect } from 'react';
// import { apiRequest } from '../lib/api';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 1. Check if user is logged in on App Load
//   useEffect(() => {
//     const checkUser = async () => {
//       try {
//         // We try to fetch the user profile.
//         // If the browser has a valid cookie, this works.
//         const userData = await apiRequest('/auth/me');
//         setUser(userData);
//       } catch (err) {
//         // If 401 Unauthorized (no cookie or expired), we set user to null
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkUser();
//   }, []);

//   // 2. Helper to update user state after Login/Register
//   const login = (userData) => {
//     setUser(userData);
//   };

//   // 3. Helper to Logout
//   const logout = async () => {
//     try {
//       await apiRequest('/auth/logout', 'POST');
//       setUser(null);
//       // Optional: Hard reload to clear any sensitive states
//       window.location.href = '/login'; 
//     } catch (err) {
//       console.error("Logout failed", err);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom Hook to access user data easily in any component
// export const useAuth = () => {
//   return useContext(AuthContext);
// };