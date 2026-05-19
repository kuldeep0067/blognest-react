import { useEffect, useState } from "react";
import API_URL from "../api";

function Notifications() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`${API_URL}/api/notifications`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setNotifications(data.notifications || []);
            });
    }, []);

    return (
        <div className="container">
            <h1 className="section-title">Notifications</h1>

            {notifications.length === 0 && <p>No notifications yet.</p>}

            <div className="notification-list">
                {notifications.map((notification) => (
                    <div className="notification-card" key={notification.id}>
                        <p>{notification.message}</p>
                        <span>{notification.created_at}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Notifications;