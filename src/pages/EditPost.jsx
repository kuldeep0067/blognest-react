import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API_URL from "../api";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import toast from "react-hot-toast";

function EditPost() {
    const { id } = useParams();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        tags: "",
        summary: "",
        content: ""
    });

    const [message, setMessage] = useState("");
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/api/posts/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setFormData({
                    title: data.post.title,
                    category: data.post.category,
                    tags: data.post.tags,
                    summary: data.post.summary,
                    content: data.post.content
                });
            });
    }, [id]);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!formData.content || formData.content === "<p><br></p>") {
            toast.error("Please write blog content.");
            return;
        }

        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/api/posts/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            toast.success("Post updated successfully.");
            navigate("/dashboard");
        } else {
            toast.error(data.message || "Update failed.");
            setMessage(data.message || "Update failed.");
        }
    }

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            ["link"],
            ["clean"]
        ]
    };

    return (
        <div className="auth-container">
            <div className="auth-card wide-card">
                <h1>Edit Post</h1>

                {message && <div className="message">{message}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Title"
                        required
                    />

                    <input
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Category"
                    />

                    <input
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="Tags"
                    />

                    <textarea
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        placeholder="Summary"
                        required
                    />

                    <ReactQuill
                        theme="snow"
                        value={formData.content}
                        modules={modules}
                        placeholder="Update your blog content..."
                        onChange={(value) =>
                            setFormData({
                                ...formData,
                                content: value
                            })
                        }
                    />

                    <button
                        type="button"
                        className="preview-btn"
                        onClick={() => setShowPreview(!showPreview)}
                    >
                        {showPreview ? "Hide Preview" : "Show Preview"}
                    </button>

                    <button type="submit">
                        Update Post
                    </button>
                </form>

                {showPreview && (
                    <div className="preview-box">
                        <h2>
                            {formData.title || "Blog Title Preview"}
                        </h2>

                        <p className="single-summary">
                            {formData.summary || "Blog summary preview..."}
                        </p>

                        <div
                            className="single-content"
                            dangerouslySetInnerHTML={{
                                __html: formData.content
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditPost;