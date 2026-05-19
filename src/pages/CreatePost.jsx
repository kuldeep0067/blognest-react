import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import toast from "react-hot-toast";

function CreatePost() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        tags: "",
        summary: "",
        content: "",
        image: null
    });

    const [draftLoaded, setDraftLoaded] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    // const [aiTitles, setAiTitles] = useState("");

    useEffect(() => {
        const savedDraft = localStorage.getItem("blog_draft");

        if (savedDraft) {
            const parsedDraft = JSON.parse(savedDraft);

            setFormData({
                title: parsedDraft.title || "",
                category: parsedDraft.category || "",
                tags: parsedDraft.tags || "",
                summary: parsedDraft.summary || "",
                content: parsedDraft.content || "",
                image: null
            });
        }

        setDraftLoaded(true);
    }, []);

    useEffect(() => {
        if (!draftLoaded) return;

        const draftToSave = {
            title: formData.title,
            category: formData.category,
            tags: formData.tags,
            summary: formData.summary,
            content: formData.content
        };

        localStorage.setItem(
            "blog_draft",
            JSON.stringify(draftToSave)
        );
    }, [formData, draftLoaded]);

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

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    function isContentEmpty(html) {
        const text = html.replace(/<(.|\n)*?>/g, "").trim();

        return text.length === 0;
    }

    function clearDraft() {
        localStorage.removeItem("blog_draft");

        setFormData({
            title: "",
            category: "",
            tags: "",
            summary: "",
            content: "",
            image: null
        });

        setAiTitles("");

        toast.success("Draft cleared.");
    }

    // async function generateAITitles() {
    //     if (!formData.title.trim()) {
    //         toast.error("Enter a topic first.");
    //         return;
    //     }

    //     const token = localStorage.getItem("token");

    //     if (!token) {
    //         toast.error("Please login first.");
    //         navigate("/login");
    //         return;
    //     }

    //     const response = await fetch(
    //         `${API_URL}/api/ai/generate-title`,
    //         {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`
    //             },
    //             body: JSON.stringify({
    //                 topic: formData.title
    //             })
    //         }
    //     );

    //     const data = await response.json();

    //     if (data.success) {
    //         setAiTitles(data.titles);
    //         toast.success("AI titles generated.");
    //     } else {
    //         toast.error(data.message || "AI failed.");
    //     }
    // }

    async function handleSubmit(e) {
        e.preventDefault();

        if (isContentEmpty(formData.content)) {
            toast.error("Please write blog content.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please login first.");
            navigate("/login");
            return;
        }

        const form = new FormData();

        form.append("title", formData.title);
        form.append("category", formData.category);
        form.append("tags", formData.tags);
        form.append("summary", formData.summary);
        form.append("content", formData.content);

        if (formData.image) {
            form.append("image", formData.image);
        }

        const response = await fetch(`${API_URL}/api/posts`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: form
        });

        const data = await response.json();

        if (data.success) {
            toast.success("Post published successfully.");

            localStorage.removeItem("blog_draft");

            navigate("/");
        } else {
            toast.error(data.message || "Post creation failed.");
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card wide-card">
                <h1>Create Post</h1>

                <p>Write and publish your blog.</p>

                <form onSubmit={handleSubmit}>
                    <input
                        name="title"
                        placeholder="Title / Topic"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    {/* <button
                        type="button"
                        className="ai-btn"
                        onClick={generateAITitles}
                    >
                        Generate AI Titles
                    </button> */}

                    {/* {aiTitles && (
                        <div className="ai-results">
                            <h3>AI Generated Titles</h3>

                            <pre>{aiTitles}</pre>
                        </div>
                    )} */}

                    <input
                        name="category"
                        placeholder="Category"
                        value={formData.category}
                        onChange={handleChange}
                    />

                    <input
                        name="tags"
                        placeholder="Tags: python, flask"
                        value={formData.tags}
                        onChange={handleChange}
                    />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                image: e.target.files[0]
                            })
                        }
                    />

                    <textarea
                        name="summary"
                        placeholder="Short summary"
                        value={formData.summary}
                        onChange={handleChange}
                        required
                    />

                    <ReactQuill
                        theme="snow"
                        value={formData.content}
                        modules={modules}
                        placeholder="Write your full blog content here..."
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
                        Publish Post
                    </button>

                    <button
                        type="button"
                        className="clear-draft-btn"
                        onClick={clearDraft}
                    >
                        Clear Draft
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

export default CreatePost;