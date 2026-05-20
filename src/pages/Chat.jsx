// import { useEffect, useState } from "react";
// // import { io } from "socket.io-client";
// import API_URL from "../api";

// // const socket = io(API_URL, {
// //     transports: ["websocket", "polling"]
// // });

// function Chat() {
//     const [message, setMessage] = useState("");
//     const [messages, setMessages] = useState([]);
//     const [onlineUsers, setOnlineUsers] = useState([]);

//     const username = localStorage.getItem("username") || "Guest";

//     useEffect(() => {
//         socket.on("connect", () => {
//             socket.emit("user_connected", {
//                 username: username
//             });
//         });

//         socket.emit("user_connected", {
//             username: username
//         });

//         socket.on("receive_message", (data) => {
//             setMessages((prev) => [...prev, data]);
//         });

//         socket.on("online_users", (users) => {
//             setOnlineUsers(users);
//         });

//         return () => {
//             socket.off("connect");
//             socket.off("receive_message");
//             socket.off("online_users");
//         };
//     }, [username]);

//     function sendMessage(e) {
//         e.preventDefault();

//         if (!message.trim()) {
//             return;
//         }

//         socket.emit("send_message", {
//             username: username,
//             message: message
//         });

//         setMessage("");
//     }

//     return (
//         <div className="container">
//             <div className="chat-box">
//                 <h1>Real-time Chat</h1>

//                 <div className="online-users-box">
//                     <h3>Online Users ({onlineUsers.length})</h3>

//                     <div className="online-users-list">
//                         {onlineUsers.map((user, index) => (
//                             <span className="online-user" key={index}>
//                                 🟢 {user}
//                             </span>
//                         ))}
//                     </div>
//                 </div>

//                 <div className="messages-area">
//                     {messages.map((msg, index) => (
//                         <div className="message-item" key={index}>
//                             <strong>{msg.username}</strong>
//                             <p>{msg.message}</p>
//                         </div>
//                     ))}
//                 </div>

//                 <form onSubmit={sendMessage} className="chat-form">
//                     <input
//                         type="text"
//                         placeholder="Type message..."
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                     />

//                     <button type="submit">Send</button>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default Chat;

function Chat() {
    return (
        <div className="container">
            <div className="chat-box">
                <h1>Real-time Chat</h1>

                <p>
                    Chat feature is temporarily disabled in production.
                    It will be added later with a dedicated WebSocket service.
                </p>
            </div>
        </div>
    );
}

export default Chat;