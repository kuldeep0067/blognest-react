import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API_URL from "../api";

function AdminUsers() {
    const [users, setUsers] = useState([]);

    function loadUsers() {
        const token = localStorage.getItem("token");

        fetch(`${API_URL}/api/admin/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setUsers(data.users || []);
            });
    }

    useEffect(() => {
        loadUsers();
    }, []);

    async function toggleAdmin(userId) {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `${API_URL}/api/admin/users/${userId}/toggle-admin`,
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
            loadUsers();
        } else {
            toast.error(data.message || "Action failed.");
        }
    }

    return (
        <div className="container">
            <h1 className="section-title">
                Manage Users
            </h1>

            <div className="admin-table">
                {users.map((user) => (
                    <div
                        className="admin-row"
                        key={user.id}
                    >
                        <div>
                            <h3>
                                {user.username}
                            </h3>

                            <p>{user.email}</p>

                            <p>
                                Admin:{" "}
                                {user.is_admin
                                    ? "Yes"
                                    : "No"}{" "}
                                · Verified:{" "}
                                {user.is_verified
                                    ? "Yes"
                                    : "No"}
                            </p>
                        </div>

                        <button
                            className="edit-btn"
                            onClick={() =>
                                toggleAdmin(user.id)
                            }
                        >
                            {user.is_admin
                                ? "Remove Admin"
                                : "Make Admin"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminUsers;