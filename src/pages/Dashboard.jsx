import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import API_URL from "../api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function Dashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`${API_URL}/api/my-posts`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.success) {
                   localStorage.removeItem("token");
                   window.location.href = "/login"; 
                   return;
                }   

                setData(data);
            });
    }, []);

    async function handleDelete(postId) {
        const token = localStorage.getItem("token");

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmDelete) {
            return;
        }

        const response = await fetch(`${API_URL}/api/posts/${postId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            toast.success("Post deleted.");

            setData((prev) => ({
                ...prev,
                posts: prev.posts.filter((post) => post.id !== postId)
            }));
        }
    }

    if (!data || !data.posts) {
        return (
            <div className="container">
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
      <> 
        <div className="container">
            <div className="dashboard-header-react">
                <h1>Dashboard</h1>

                <p>
                    Welcome, <strong>{data.username}</strong>
                </p>

                <p>{data.email}</p>

                <p>{data.bio}</p>
            </div>

            <div className="dashboard-stats">
                <div className="stat-box">
                    <h2>{data.posts.length}</h2>
                    <p>Total Posts</p>
                </div>

                <div className="stat-box">
                    <h2>
                        {data.posts.reduce((acc, post) => acc + post.views, 0)}
                    </h2>
                    <p>Total Views</p>
                </div>
            </div>

            <h2 className="section-title">Your Posts</h2>

            <div className="post-grid">
                {data.posts.map((post) => (
                    <div className="post-card" key={post.id}>
                        <h3>{post.title}</h3>

                        <p>{post.summary}</p>

                        <div className="post-meta">
                            <span>{post.views} views</span>
                            <span>{post.created_at}</span>
                        </div>

                        <div className="post-stats">
                            ❤️ {post.likes} · 💬 {post.comments}
                        </div>

                        <Link
                            to={`/edit-post/${post.id}`}
                            className="edit-btn"
                        >
                            Edit
                        </Link>

                        <button
                            onClick={() => handleDelete(post.id)}
                            className="delete-btn"
                        >
                            Delete
                        </button>

                    </div>
                ))}
            </div>
        </div>
     </>    
    );
}

export default Dashboard;