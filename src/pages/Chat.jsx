import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import API_URL from "../api";

const socket = io("http://127.0.0.1:5000");

function Chat() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const username = localStorage.getItem("username") || "Guest";

   useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`${API_URL}/api/chat/messages`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setMessages(data.messages || []);
            });

        socket.on("receive_message", (data) => {
            setMessages((prev) => [
                ...prev,
                data
            ]);
        });

        return () => {
            socket.off("receive_message");
        };
    }, []);

    function sendMessage(e) {
        e.preventDefault();

        if (!message.trim()) {
            return;
        }

        socket.emit("send_message", {
            username,
            message
        });

        setMessage("");
    }

    return (
        <div className="container">
            <div className="chat-box">
                <h1>Real-time Chat</h1>

                <div className="messages-area">
                    {messages.map((msg, index) => (
                        <div className="message-item" key={index}>
                            <strong>{msg.username}</strong>
                            <p>{msg.message}</p>
                            <small>{msg.created_at}</small>
                        </div>
                    ))}
                </div>

                <form onSubmit={sendMessage} className="chat-form">
                    <input
                        type="text"
                        placeholder="Type message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <button type="submit">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Chat;