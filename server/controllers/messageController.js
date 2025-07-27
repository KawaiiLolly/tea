import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import {io, userSocketMap} from "../server.js"

export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filtererdUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );
    // COUNT NO OF MESSAGES
    const unseenMessages = {};
    const promises = filtererdUsers.map(async () => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });
    await Promise.all(promises);
    res.json({ success: true, users: filtererdUsers, unseenMessages });
  } catch (error) {
    console.log(error.messages);
    res.json({ success: false, message: error.message });
  }
};

// GET ALL MESSAGES FOR SELECTED USER

export const getMessages = async (req, res) => {
  try {
    const { id: selectdUserId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectdUserId },
        { senderId: selectdUserId, receiverId: myId },
      ],
    });
    await Message.updateMany(
      { senderId: selectdUserId, receiverId: myId },
      { seen: true }
    );
    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.messages);
    res.json({ success: false, message: error.message });
  }
};

// API TO MARK MESSAGE AS SEEN

export const markMessageSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    console.log(error.messages);
    res.json({ success: false, message: error.message });
  }
};

// SEND MESSAGE

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;
    let imageUrl;
    if(image) {
        const uploadResponse = await cloudinary.uploader.upload(image)
        imageUrl = uploadResponse.secure_url
    }
    const newMessage = await Message.create({
        senderId, receiverId, text, image: imageUrl
    })

    // EMIT THE NEW MESSAGE TO THE RECEIVER SOCKET
    const receiverSocketId = userSocketMap[receiverId]
    if(receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    res.json({success: true, newMessage})
  } catch (error) {
    console.log(error.messages);
    res.json({ success: false, message: error.message });
  }
};
