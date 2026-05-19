import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import API_URL from "../api";

function Profile() {
    const [formData, setFormData] = useState({
        username: "",
        bio: ""
    });

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`${API_URL}/api/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setFormData({
                    username: data.user.username,
                    bio: data.user.bio
                });

                setEmail(data.user.email);
            });
    }, []);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/api/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            setMessage("Profile updated successfully.");

            localStorage.setItem("username", formData.username);
        }
    }

    return (
     <>
        <Helmet>
          <title>Profile - BlogNest</title>
        </Helmet>
        <div className="auth-container">
            <div className="auth-card">
                <h1>Profile</h1>

                {message && <div className="message">{message}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        required
                    />

                    <input
                        type="email"
                        value={email}
                        disabled
                    />

                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Your bio..."
                    />

                    <button type="submit">
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
     </>   
    );
}

export default Profile;