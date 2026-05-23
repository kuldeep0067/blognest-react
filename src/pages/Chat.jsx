import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import API_URL from "../api";

const socket = io(
    "http://127.0.0.1:5000",
    {
        transports: ["websocket"],
        reconnection: true
    }
);

function Chat() {
    const [message, setMessage] = useState("");
    const [connected, setConnected] = useState(false);
    const [sending, setSending] = useState(false);
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const messagesEndRef = useRef(null);

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

                const sortedMessages =
                    (data.messages || []).sort(
                        (a, b) =>
                            new Date(a.created_at) -
                            new Date(b.created_at)
                    );

                setMessages(sortedMessages);

            });
        socket.on("online_users", (users) => {
            setOnlineUsers(users);
        });


        socket.off("receive_message");

        socket.on("receive_message", (data) => {

            console.log(
                "Message received:",
                data
            );

           setMessages((prev) => {
                const exists = prev.some(
                    (msg) =>
                        msg.message === data.message &&
                        msg.username === data.username &&
                        msg.created_at === data.created_at
                );

                if (exists) return prev;

                const updated = [
                    ...prev,
                    data
                ];

                updated.sort(
                   (a, b) =>
                        new Date(a.created_at) -
                        new Date(b.created_at)
                );

                return updated.slice(-50);
            });
        });

        socket.on("connect", () => {
            setConnected(true);

            socket.emit("user_connected", {
                username
            });
        });

        socket.on("disconnect", () => {
            setConnected(false);
        });

        socket.on(
            "connect_error",
            (err) => {

                console.log(
                    "Socket error:",
                    err.message
                );

                toast.error(
                    "Chat connection failed."
                );
            }
        );

        socket.on(
            "error",
            (err) => {

                console.log(
                    "Socket generic error:",
                    err
                );

                toast.error(
                    "Socket error occurred."
                );
            }
        );

        return () => {
            socket.off("receive_message");
            socket.off("online_users");
            socket.off("connect");
            socket.off("disconnect");
            socket.off("connect_error");
            socket.off("error");
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }

    function sendMessage(e) {
        e.preventDefault();

        if (sending) return;

        if (!connected) return;

        if (!message.trim()) return;

        setSending(true);

        console.log(
            "Sending message:",
            message
        );

        socket.emit(
            "send_message",
            {
                username,
                message
            },
            (response) => {

                if (
                    response &&
                    response.success
                ) {

                    setSending(false);

                } else {

                    setSending(false);

                    alert(
                        "Message failed."
                    );
                }
            }
        );

        setMessage("");

    }

    return (
        <div className="container">
            <div className="chat-box">
                <h1>Real-time Chat</h1>

                <p>
                    Status:
                    {connected ? " 🟢 Connected" : " 🔴 Disconnected"}
                </p>
              
                <div className="online-users-box">
                    <h3>
                        Online Users ({onlineUsers.length})
                    </h3>

                    <div className="online-users-list">
                        {onlineUsers.map((user, index) => (
                            <span
                                className="online-user"
                                key={user || index}
                            >
                                🟢 {user}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="messages-area">
                    {messages.map((msg, index) => (
                        <div
                            className={
                                msg.username === username
                                    ? "message-item my-message"
                                    : "message-item"
                            }
                            key={msg.id || index}
                        >
                            <strong>{msg.username}</strong>

                            <p>{msg.message}</p>

                            <small>
                                {msg.created_at}
                            </small>
                        </div>
                    ))}

                    <div ref={messagesEndRef}></div>
                </div>

                <form onSubmit={sendMessage} className="chat-form">
                    <input
                        type="text"
                        placeholder="Type message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}

                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendMessage(e);
                            }
                        }}
                    />

                    <button
                        type="submit"
                        disabled={
                            !connected ||
                            sending ||
                            !message.trim()
                        }
                    >
                        {sending
                            ? "Sending..."
                            : "Send"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Chat;