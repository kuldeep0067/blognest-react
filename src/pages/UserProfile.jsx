import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import API_URL from "../api";

function UserProfile() {
    const { username } = useParams();

    const [data, setData] = useState(null);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`${API_URL}/api/users/${username}`, {
            headers: token
                ? {
                      Authorization: `Bearer ${token}`
                  }
                : {}
        })
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setFollowers(data.followers_count);
                setFollowing(data.is_following);
            });
    }, [username]);

    async function handleFollow() {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please login first.");
            return;
        }

        const response = await fetch(
            `${API_URL}/api/users/${username}/follow`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (data.success) {
            setFollowing(data.following);
            setFollowers(data.followers_count);
            toast.success(data.message);
        } else {
            toast.error(data.message || "Something went wrong.");
        }
    }

    if (!data) {
        return (
            <div className="container">
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="profile-header">
                <h1>{data.user.username}</h1>

                <p>{data.user.bio}</p>

                <div className="profile-stats">
                    <span>{data.posts.length} Posts</span>
                    <span>{followers} Followers</span>
                </div>

                {localStorage.getItem("username") !== data.user.username && (
                    <div className="follow-section">
                        <button
                           onClick={handleFollow}
                           className="follow-btn"
                        >
                           {following ? "Following" : "Follow"}
                        </button>

                        <Link
                            to={`/messages/${username}`}
                            className="message-btn"
                        >
                            Message
                        </Link>

                    </div>
                )}
            </div>

            <div className="post-grid">
                {data.posts.map((post) => (
                    <div className="post-card" key={post.id}>
                        <span className="category-badge">
                            {post.category}
                        </span>

                        <h2>
                            <Link to={`/post/${post.id}`}>
                                {post.title}
                            </Link>
                        </h2>

                        <p>{post.summary}</p>

                        <div className="post-meta">
                            <span>{post.views} views</span>
                            <span>{post.created_at}</span>
                        </div>

                        <div className="post-stats">
                            ❤️ {post.likes} · 💬 {post.comments}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserProfile;