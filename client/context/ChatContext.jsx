import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext.jsx";
import toast from "react-hot-toast";
import { useEffect } from "react";

export const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState({})
    const { socket, axios, authUser, token } = useContext(AuthContext)

    // FUNCTION TO GET ALL USER FOR SIDEBAR
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (data.success) {
                console.log("Users fetched:", data.users)
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message)
            console.log("getUsers error:", error)
        }
    }


    // FUNCTION TO GET ALL MESSAGES FROM A USER
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`, {
                headers: {
                    token: token
                }

            })
            if (data.success) {
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // FUNCNTION TO SEND THE MESSAGE
    // sendMessage function (ONLY send once)
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData, {
                headers: { token },
            });

            if (data.success) {
                // ✅ Update UI instantly
                setMessages((prev) => [...prev, data.newMessage]);

                // ✅ Emit to Socket.IO only once
                socket.emit("sendMessage", { ...data.newMessage, receiverId: selectedUser._id });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };



    // ✅ SUBSCRIBE TO MESSAGES
    const subscribeToMessages = () => {
        if (!socket) return;

        socket.off("newMessage"); // Clear previous listener to avoid duplicates

        socket.on("newMessage", (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            } else {
                setUnseenMessages((prev) => ({
                    ...prev,
                    [newMessage.senderId]: prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1
                }));
            }
        });
    };

    // ✅ UNSUBSCRIBE TO MESSAGES
    const unsubscribeToMessages = () => {
        if (socket) socket.off("newMessage");
    };


    useEffect(() => {
        subscribeToMessages()
        return () => unsubscribeToMessages()
    }, [socket, selectedUser])

    const value = {
        messages, users, selectedUser, getUsers, sendMessage, getMessages, setSelectedUser, unseenMessages, setUnseenMessages
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}