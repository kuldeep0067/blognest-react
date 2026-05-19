import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import API_URL from "../api";

function Inbox() {
    const [conversations, setConversations] =
        useState([]);

    useEffect(() => {
        const token =
            localStorage.getItem("token");

        fetch(`${API_URL}/api/inbox`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setConversations(
                    data.conversations || []
                );
            });
    }, []);

    return (
        <div className="container">
            <h1 className="section-title">
                Inbox
            </h1>

            <div className="inbox-list">
                {conversations.map((chat) => (
                    <Link
                        to={`/messages/${chat.username}`}
                        className="inbox-item"
                        key={chat.username}
                    >
                        <div>
                            <h3>
                                {chat.username}
                            </h3>

                            <p>
                                {chat.last_message}
                            </p>
                        </div>

                        <span>
                            {chat.created_at}
                        </span>
                    </Link>
                ))}

                {conversations.length === 0 && (
                    <p>No conversations yet.</p>
                )}
            </div>
        </div>
    );
}

export default Inbox;
