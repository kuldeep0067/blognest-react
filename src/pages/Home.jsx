import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API_URL from "../api";

import PostSkeleton from "../components/PostSkeleton";

function Home() {
    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);

    const [hasNext, setHasNext] = useState(true);

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("");

    async function loadPosts(
        pageNumber = 1,
        searchTerm = "",
        categoryTerm = "",
        append = false
    ) {
        setLoading(true);

        const response = await fetch(
            `${API_URL}/api/posts?page=${pageNumber}&search=${searchTerm}&category=${categoryTerm}`
        );

        const data = await response.json();

        if (append) {
            setPosts((prev) => [...prev, ...data.posts]);
        } else {
            setPosts(data.posts);
        }

        setHasNext(data.has_next);

        setLoading(false);
    }

    useEffect(() => {
        loadPosts();
    }, []);

    useEffect(() => {
        function handleScroll() {
            if (
                window.innerHeight + window.scrollY >=
                    document.body.offsetHeight - 200 &&
                hasNext &&
                !loading
            ) {
                const nextPage = page + 1;

                setPage(nextPage);

                loadPosts(
                    nextPage,
                    search,
                    category,
                    true
                );
            }
        }

        window.addEventListener("scroll", handleScroll);

        return () =>
            window.removeEventListener("scroll", handleScroll);
    }, [page, hasNext, loading, search, category]);

    function handleSearch(e) {
        e.preventDefault();

        setPage(1);

        loadPosts(1, search, category);
    }

    function handleCategory(cat) {
        setCategory(cat);

        setPage(1);

        loadPosts(1, search, cat);
    }

    return (
      <>
        <Helmet>
           <title>BlogNest</title>
        </Helmet>
        <div className="container">
            <div className="hero-section">
                <h1>Welcome to BlogNest 🚀</h1>

                <p>
                     Write blogs, connect with people,
                    and share your ideas with the world.
                </p>
            </div>
                   

            <div className="home-top">
                <h1>Latest Blogs</h1>

                <form
                    onSubmit={handleSearch}
                    className="search-form"
                >
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <button type="submit">
                        Search
                    </button>
                </form>
            </div>

            <div className="category-filters">
                {[
                    "",
                    "Python",
                    "Flask",
                    "React",
                    "AI",
                    "DSA"
                ].map((cat) => (
                    <button
                        key={cat || "All"}
                        onClick={() => handleCategory(cat)}
                        className={
                            category === cat
                                ? "active-category"
                                : ""
                        }
                    >
                        {cat || "All"}
                    </button>
                ))}
            </div>

            <div className="post-grid">
                {posts.map((post) => (
                    <div
                        className="post-card"
                        key={post.id}

                    >

                        {post.image_url && (
                            <img
                                src={post.image_url}
                                alt={post.title}
                                className="post-image"
                            />
                        )}

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
                            <Link to={`/user/${post.author}`}>
                                 {post.author}
                            </Link>

                            <span>
                                {post.views} views
                            </span>
 
                            <span>
                                ⏱ {post.reading_time} min read
                            </span> 

                        </div>

                        <div className="post-stats">
                            ❤️ {post.likes} likes · 💬{" "}
                            {post.comments} comments
                        </div>
                    </div>
                ))}

                {loading &&
                    [1,2,3].map((item) => (
                        <PostSkeleton key={item} />
                    ))}
            </div>
        </div>
      </>   
    );
}

export default Home;