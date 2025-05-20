import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Register from "./pages/auth/register/Register";
import Login from "./pages/auth/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/dashboard/home/Home";
import Search from "./pages/dashboard/search/Search";
import Chat from "./pages/dashboard/chat/Chat";
import Settings from "./pages/dashboard/settings/Settings";
import Profile from "./pages/dashboard/profile/Profile";
import Add from "./pages/dashboard/add/Add";
import { PrivateRoute } from "./global/PrivateRoute";
import User from "./pages/dashboard/user/User";

function App(){
    return(
        <Router>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/" element={
                    <PrivateRoute>
                        <Dashboard/>
                    </PrivateRoute>
                }>
                    <Route index element={<Navigate to="home" replace/>}/>
                    <Route path="add" element={<Add/>}/>
                    <Route path="home" element={<Home/>}/>
                    <Route path="search" element={<Search/>}/>
                    <Route path="chat" element={<Chat/>}/>
                    <Route path="settings" element={<Settings/>}/>
                    <Route path="profile" element={<Profile/>}/>
                    <Route path=":username" element={<User/>}/>
                </Route>
            </Routes>
        </Router>
    )
}

export default App
