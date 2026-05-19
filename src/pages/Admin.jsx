import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API_URL from "../api";

function Admin() {
    const [data, setData] = useState(null);

    function loadAdminData() {
        const token = localStorage.getItem("token");

        fetch(`${API_URL}/api/admin/dashboard`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setData(data);
            });
    }

    useEffect(() => {
        loadAdminData();
    }, []);

    async function handleDelete(postId) {
        if (!window.confirm("Delete this post?")) return;

        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/api/admin/posts/${postId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (result.success) {
            toast.success("Post deleted.");
            loadAdminData();
        } else {
            toast.error(result.message || "Delete failed.");
        }
    }

    if (!data) {
        return <div className="container">Loading admin panel...</div>;
    }

    if (!data.success) {
        return <div className="container">{data.message}</div>;
    }

    return (
        <div className="container">
            <div className="dashboard-header-react">
                <h1>Admin Panel</h1>
                <p>Manage BlogNest platform.</p>
            </div>

            <div className="dashboard-stats">
                <div className="stat-box">
                    <h2>{data.stats.users}</h2>
                    <p>Users</p>
                </div>

                <div className="stat-box">
                    <h2>{data.stats.posts}</h2>
                    <p>Posts</p>
                </div>

                <div className="stat-box">
                    <h2>{data.stats.comments}</h2>
                    <p>Comments</p>
                </div>
            </div>

            <h2 className="section-title">All Posts</h2>

            <div className="admin-table">
                {data.posts.map((post) => (
                    <div className="admin-row" key={post.id}>
                        <div>
                            <h3>{post.title}</h3>
                            <p>
                                By {post.author} · {post.status} · {post.views} views
                            </p>
                        </div>

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
    );
}

export default Admin;