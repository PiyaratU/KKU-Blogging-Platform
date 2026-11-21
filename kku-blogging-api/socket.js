const { Server } = require("socket.io");

const attachSocket = (server, allowedOrigins) => {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  let onlineUsers = [];

  io.on("connection", (socket) => {
    // ผู้ใช้เข้าสู่ระบบ — บันทึกว่าออนไลน์
    socket.on("addNewUser", (userId) => {
      if (userId && !onlineUsers.some((user) => user.userId === userId)) {
        onlineUsers.push({ userId, socketId: socket.id });
      }
      io.emit("getOnlineUsers", onlineUsers);
    });

    // ส่งข้อความถึงผู้รับที่ออนไลน์อยู่ (ข้อความถูกบันทึกลง DB ผ่าน API แล้ว)
    socket.on("sendMessage", (message) => {
      const recipientUser = onlineUsers.find((user) => user.userId === message.recipientId);
      if (!recipientUser) return;

      io.to(recipientUser.socketId).emit("getMessage", {
        ...message,
        createdAt: new Date(),
        isFromSender: false,
      });

      io.to(recipientUser.socketId).emit("getNotification", {
        senderId: message.senderId,
        chatId: message.chatId,
        text: message.text,
        isRead: false,
        createdAt: new Date(),
      });
    });

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit("getOnlineUsers", onlineUsers);
    });
  });

  return io;
};

module.exports = { attachSocket };
