import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API_URL from "../api";

function Navbar() {
    const navigate = useNavigate();

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [username, setUsername] = useState(
        localStorage.getItem("username")
    );

    const [unreadCount, setUnreadCount] = useState(0);

    const [menuOpen, setMenuOpen] = useState(false);

    const isAdmin =
        localStorage.getItem("is_admin") === "true";

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    async function loadUnreadCount() {
        const savedToken = localStorage.getItem("token");

        if (
            !savedToken ||
            savedToken === "null" ||
            savedToken === "undefined"
        ) {
            setUnreadCount(0);
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/notifications/unread-count`,
                {
                    headers: {
                        Authorization: `Bearer ${savedToken}`
                    }
                }
            );

            if (
                response.status === 401 ||
                response.status === 422
            ) {
                localStorage.removeItem("token");
                localStorage.removeItem("username");

                setToken(null);
                setUsername(null);
                setUnreadCount(0);

                return;
            }

            const data = await response.json();

            if (data.success) {
                setUnreadCount(data.count || 0);
            } else {
                setUnreadCount(0);
            }
        } catch (error) {
            setUnreadCount(0);
        }
    }

    useEffect(() => {
        setToken(localStorage.getItem("token"));
        setUsername(localStorage.getItem("username"));

        loadUnreadCount();

        const interval = setInterval(() => {
            loadUnreadCount();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("is_admin");


        setToken(null);
        setUsername(null);
        setUnreadCount(0);

        navigate("/login");
    }

    return (
        <nav className="navbar">
            <div className="nav-logo">
                <Link to="/">BlogNest</Link>
            </div>

            <button
                className="menu-btn"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                ☰
            </button>

            <div className={menuOpen ? "nav-links open" : "nav-links"}>
                <Link to="/">Home</Link>

                {token ? (
                    <>
                        <Link to="/create-post">
                            Create Post
                        </Link>

                        <Link to="/dashboard">
                            Dashboard
                        </Link>

                        {isAdmin && (
                            <Link to="/admin">
                                 Admin
                            </Link>
                        )}

                        {isAdmin && (
                            <Link to="/admin/users">
                                Users
                            </Link>
                        )}

                        <Link to="/profile">
                            Profile
                        </Link>

                        <Link to="/saved-posts">
                            Saved
                        </Link>

                        {/* <Link to="/chat">
                            Chat
                        </Link> */}
 
                        {/* <Link to="/inbox">
                             Inbox
                        </Link> */}

                        <Link
                            to="/notifications"
                            className="notification-link"
                        >
                            Notifications

                            {unreadCount > 0 && (
                                <span className="notification-badge">
                                    {unreadCount}
                                </span>
                            )}
                        </Link>

                        <span className="nav-user">
                            Hi, {username}
                        </span>

                        <button
                            onClick={() =>
                                setDarkMode(!darkMode)
                            }
                            className="theme-btn"
                        >
                            {darkMode
                                ? "☀️ Light"
                                : "🌙 Dark"}
                        </button>

                        <button
                            onClick={handleLogout}
                            className="logout-btn"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() =>
                                setDarkMode(!darkMode)
                            }
                            className="theme-btn"
                        >
                            {darkMode
                                ? "☀️ Light"
                                : "🌙 Dark"}
                        </button>

                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;