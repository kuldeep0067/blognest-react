// import { useEffect, useState } from "react";

// import { useParams } from "react-router-dom";

// // import { io } from "socket.io-client";

// import API_URL from "../api";

// // const socket = io(API_URL);

// function DirectMessage() {
//     const { username } = useParams();

//     const currentUser =
//         localStorage.getItem("username");

//     const token =
//         localStorage.getItem("token");

//     const [message, setMessage] = useState("");

//     const [messages, setMessages] = useState([]);

//     useEffect(() => {
//         fetch(
//             `${API_URL}/api/messages/${username}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             }
//         )
//             .then((res) => res.json())
//             .then((data) => {
//                 setMessages(data.messages || []);
//             });

//         socket.on(
//             "receive_private_message",
//             (data) => {
//                 if (
//                     (
//                         data.sender === currentUser &&
//                         data.receiver === username
//                     )
//                     ||
//                     (
//                         data.sender === username &&
//                         data.receiver === currentUser
//                     )
//                 ) {
//                     setMessages((prev) => [
//                         ...prev,
//                         data
//                     ]);
//                 }
//             }
//         );

//         return () => {
//             socket.off(
//                 "receive_private_message"
//             );
//         };
//     }, [username]);

//     function sendMessage(e) {
//         e.preventDefault();

//         if (!message.trim()) return;

//         socket.emit(
//             "send_private_message",
//             {
//                 sender: currentUser,
//                 receiver: username,
//                 message
//             }
//         );

//         setMessage("");
//     }

//     return (
//         <div className="container">
//             <div className="chat-box">
//                 <h1>
//                     Chat with {username}
//                 </h1>

//                 <div className="messages-area">
//                     {messages.map((msg, index) => (
//                         <div
//                             className={`message-item ${
//                                 msg.sender === currentUser
//                                     ? "my-message"
//                                     : ""
//                             }`}
//                             key={index}
//                         >
//                             <strong>
//                                 {msg.sender}
//                             </strong>

//                             <p>
//                                 {msg.content || msg.message}
//                             </p>
//                         </div>
//                     ))}
//                 </div>

//                 <form
//                     onSubmit={sendMessage}
//                     className="chat-form"
//                 >
//                     <input
//                         type="text"
//                         placeholder="Type message..."
//                         value={message}
//                         onChange={(e) =>
//                             setMessage(e.target.value)
//                         }
//                     />

//                     <button type="submit">
//                         Send
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default DirectMessage;

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