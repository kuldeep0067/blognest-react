import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";
import toast from "react-hot-toast";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {

        e.preventDefault();

        setLoading(true);

        try {

            const response = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {

                toast.success("Login successful.");

                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.username);
                localStorage.setItem("is_admin", data.is_admin);

                navigate("/dashboard");

            } else {

                toast.error(data.message || "Login failed.");

            }

        } catch (error) {

            console.log(error);

            toast.error("Server error. Please try again.");

        } finally {

            setLoading(false);

        }
    }

    return (
        <div className="auth-container">

            <div className="auth-card">

                <h1>Login</h1>

                <p>Welcome back to BlogNest.</p>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;