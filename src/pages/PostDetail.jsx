import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import API_URL from "../api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";


function PostDetail() {
    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [message, setMessage] = useState("");

    function loadComments() {
        fetch(`${API_URL}/api/posts/${id}/comments`)
            .then((res) => res.json())
            .then((data) => {
                setComments(data.comments || []);
            });
    }

    useEffect(() => {
        fetch(`${API_URL}/api/posts/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setPost(data.post);
            });

        loadComments();
    }, [id]);

    async function handleCommentSubmit(e) {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("Please login to comment.");
            return;
        }


        const response = await fetch(`${API_URL}/api/posts/${id}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                content: commentText
            })
        });

        const data = await response.json();

        if (data.success) {
            setCommentText("");
            toast.success("Comment added.");
            loadComments();
        } else {
            toast.error(data.message || "Comment failed.");
        }
    }

    async function handleLike() {
        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("Please login to like this post.");
            return;
        }

        const response = await fetch(`${API_URL}/api/posts/${id}/like`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            setPost({
                ...post,
                likes: data.likes
            });

            toast.success(data.message);
        }
    } 

    async function handleBookmark() {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please login first.");
            return;
        }

        const response = await fetch(
            `${API_URL}/api/posts/${id}/bookmark`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (data.success) {
            toast.success(data.message);
        }
    }

    if (!post) {
        return (
            <div className="container">
                <p>Loading post...</p>
            </div>
        );
    }

    return (

      <>
        <Helmet>
           <title>
              {post.title} - BlogNest
           </title>
        </Helmet>  
        <div className="container">
            <div className="single-post">
                <h1>{post.title}</h1>
                {post.image_url && (
                    <img
                        src={post.image_url}
                        alt={post.title}
                        className="single-post-image"
                        />
                )}

                <div className="single-meta">
                    <Link to={`/user/${post.author}`}>
                        {post.author}
                    </Link>
                    <span>{post.created_at}</span>
                </div>

                <div className="single-stats">
                    ❤️ {post.likes} likes · 💬 {post.comments} comments · 👁️ {post.views} views · ⏱ {post.reading_time} min read
                </div>

                <button onClick={handleLike} className="like-btn">                
                      ❤️ Like
                </button>

                <button
                    onClick={handleBookmark}
                    className="bookmark-btn"
                >
                    🔖 Save Post
                </button>
                
                <p className="single-summary">{post.summary}</p>

                <div
                    className="single-content"
                    dangerouslySetInnerHTML={{
                        __html: post.content
                    }}
                />
            </div>

            <div className="comments-box">
                <h2>Comments</h2>

                {message && <div className="message">{message}</div>}

                <form onSubmit={handleCommentSubmit} className="comment-form-react">
                    <textarea
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        required
                    />

                    <button type="submit">Post Comment</button>
                </form>

                <div className="comment-list">
                    {comments.length === 0 && <p>No comments yet.</p>}

                    {comments.map((comment) => (
                        <div className="comment-item" key={comment.id}>
                            <div className="comment-top">
                                <strong>{comment.author}</strong>
                                <span>{comment.created_at}</span>
                            </div>

                            <p>{comment.content}</p>
                        </div>
                    ))}
                </div>
            </div>
       </div>

     </>  
    );
}

export default PostDetail;