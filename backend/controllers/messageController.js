import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// <---------------------------------------------Message Friend----------------------------------------------->
export const messageFriend = async (req, res) => {
  try {
    // Fetching the Details
    const senderId = req.id;
    const receiverId = req.params.id;

    const { message } = req.body;

    // Validating the Details
    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: "Participants Not found",
      });
    }

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message not found",
      });
    }

    // Creating the Conversation

    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        message: [],
      });
    }

    const messageResponse = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (message) {
      conversation.message.push(messageResponse._id);
    }

    await Promise.all([conversation.save(), messageResponse.save()]);
    

    // Implementing the Socket.io for real time communication
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("message", messageResponse);

    } else {
      console.log("Receiver is offline or socket not found");
    }

    // Sending the Response
    return res.status(200).json({
      success: true,
      messageResponse,
    });
  } catch (error) {
    console.log("Error While Message Friend", error);
    return res.status(500).json({
      success: false,
      message: "Failed to Message Friend",
    });
  }
};

// <---------------------------------------------Get Messages----------------------------------------------->
export const getMessages = async (req, res) => {
  try {
    // Fetching the Details
    const senderId = req.id;
    const receiverId = req.params.id;

    // Validating the Details
    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: "Participants Not found",
      });
    }

    // Fetching the Conversation
    const conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    }).populate("message");

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: [],
      });
    }

    // Sending the Response
    return res.status(200).json({
      success: true,
      message: conversation?.message,
    });
  } catch (error) {
    console.log("Error while getting the Message ");
    return res.status(500).json({
      success: false,
      message: "Failed while Retriving the Messaging the Friend",
    });
  }
};
