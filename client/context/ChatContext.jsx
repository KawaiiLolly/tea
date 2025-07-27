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
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData, {
                headers: {
                    token: token
                }

            })
            if (data.success) {
                setMessages((prevMessages) => [...prevMessages, data.newMessage])

            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)

        }
    }

    // FUNC TO SUBSCRIBE TO MESSAGES FOR SELECTED USER
    const subscribeToMessages = async () => {
        if (!socket) return;
        socket.on("newMessages", (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`)
            } else {
                setUnseenMessages((prevUnseenMessages) => (
                    {
                        ...prevUnseenMessages, [newMessage.senderId]: prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                    }
                ))
            }
        })
    }

    // FUNC TO UNSUBSCRIBE TO MESSAGES FOR SELECTED USER
    const unsubscribeToMessages = () => {
        if (socket) socket.off("newMessage")
    }

    useEffect(() => {
        subscribeToMessages()
        return () => unsubscribeToMessages()
    }, [socket, selectedUser])

    const value = {
        messages, users, selectedUser, getUsers, sendMessage, setMessages, setSelectedUser, unseenMessages, setUnseenMessages
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}