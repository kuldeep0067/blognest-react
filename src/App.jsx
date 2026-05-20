import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import DirectMessage from "./pages/DirectMessage";
import Inbox from "./pages/Inbox";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Profile from "./pages/Profile";
import SavedPosts from "./pages/SavedPosts";
import UserProfile from "./pages/UserProfile";
import AdminUsers from "./pages/AdminUsers";
import Notifications from "./pages/Notifications";
import ProtectedRoute from "./components/ProtectedRoute";
import PostDetail from "./pages/PostDetail";



function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                       path="/dashboard"
                       element={
                              <ProtectedRoute>
                                 <Dashboard />
                              </ProtectedRoute>
                       }
                />

                <Route
                        path="/profile"
                        element={
                               <ProtectedRoute>
                                   <Profile />
                              </ProtectedRoute>
                        }
                />

                <Route path="/chat" element={
                    <ProtectedRoute>
                        <Chat />
                    </ProtectedRoute>
                } />

                {/* <Route path="/messages/:username" element={
                    <ProtectedRoute>
                        <DirectMessage />
                    </ProtectedRoute>
                } /> */}

                <Route path="/admin" element={
                    <ProtectedRoute>
                         <Admin />
                    </ProtectedRoute>
                } />

                <Route path="/admin/users" element={
                    <ProtectedRoute>
                        <AdminUsers />
                    </ProtectedRoute>
                } />

                {/* <Route path="/inbox" element={
                    <ProtectedRoute>
                        <Inbox />
                    </ProtectedRoute>
                } /> */}

                <Route
                        path="/saved-posts"
                        element={
                            <ProtectedRoute>
                               <SavedPosts />
                            </ProtectedRoute>
                        }
                />
                
                <Route path="/user/:username" element={<UserProfile />} />

                <Route
                        path="/create-post"
                        element={
                            <ProtectedRoute>
                              <CreatePost />
                            </ProtectedRoute>
                        }
                />
                <Route path="/post/:id" element={<PostDetail />} />
                
                <Route path="/notifications" element={
                        <ProtectedRoute>
                            <Notifications />
                        </ProtectedRoute>
                } />

                <Route
                    path="/edit-post/:id"
                    element={
                        <ProtectedRoute>
                            <EditPost />
                        </ProtectedRoute>
                    }
                />

                

            </Routes>

            <Footer />
        </>
    );
}

export default App;