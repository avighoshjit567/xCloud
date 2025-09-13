import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Servers from "./Servers";

function AppRoutes() {
    // ProtectedRoute checks for token in localStorage
    const ProtectedRoute = ({ children }) => {
        const token = localStorage.getItem("token");
        if (!token) {
            return <Navigate to="/login" replace />;
        }
        return children;
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route path="/servers" element={
                    <ProtectedRoute>
                        <Servers />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}

export default AppRoutes;
