import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import API_URL from "../api";

function SavedPosts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`${API_URL}/api/bookmarks`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setPosts(data.posts || []);
            });
    }, []);

    return (
        <div className="container">
            <h1 className="section-title">
                Saved Posts
            </h1>

            <div className="post-grid">
                {posts.map((post) => (
                    <div
                        className="post-card"
                        key={post.id}
                    >
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
                            <span>
                                By {post.author}
                            </span>
                        </div>
                    </div>
                ))}

                {posts.length === 0 && (
                    <p>No saved posts yet.</p>
                )}
            </div>
        </div>
    );
}

export default SavedPosts;