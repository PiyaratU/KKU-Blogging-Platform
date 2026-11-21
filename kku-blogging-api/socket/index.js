const { Server } = require("socket.io");

const initializeSocket = () => {
  // Render / โฮสต์อื่นกำหนดพอร์ตผ่าน PORT · รันในเครื่องใช้ 3004 (ตรงกับ REACT_APP_SOCKET_ENDPOINT)
  // SOCKET_PORT มาก่อน PORT — กันชนกับพอร์ตของ API ตอนรันคู่กัน (npm run dev:all)
  const io = new Server(Number(process.env.SOCKET_PORT || process.env.PORT) || 3004, {
    cors: {
      // โดเมนเว็บผู้ใช้เพิ่มเติม (เช่นบน Vercel) ตั้งใน env FRONTEND_ENDPOINT ของ socket — คั่นด้วย , ได้
      origin: [
        "https://kku-client.vercel.app",
        "http://localhost:3000",
        "https://www.kkublogging.com",
        "https://kkublogging.com",
        ...(process.env.FRONTEND_ENDPOINT || "")
          .split(",")
          .map((url) => url.trim().replace(/\/$/, ""))
          .filter(Boolean),
      ],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  let onlineUsers = [];

  io.on("connection", (socket) => {
    console.log("new connection", socket.id);

    // เรียกการเชื่อมต่อ
    socket.on("addNewUser", (userId) => {
      !onlineUsers.some((user) => user.userId === userId) &&
        onlineUsers.push({
          userId,
          socketId: socket.id
        });
      io.emit("getOnlineUsers", onlineUsers);
    });

    // เพิ่มข้อความ
    socket.on("sendMessage", (message) => {
      const recipientUser = onlineUsers.find((user) => user.userId === message.recipientId);

      if (recipientUser) {
        const formattedMessage = {
          ...message,
          senderId: message.senderId,
          recipientId: message.recipientId,
          chatId: message.chatId,
          text: message.text,
          createdAt: new Date(),
          isFromSender: false
        };

        io.to(recipientUser.socketId).emit("getMessage", formattedMessage);

        io.to(recipientUser.socketId).emit("getNotification", {
          senderId: message.senderId,
          chatId: message.chatId,
          text: message.text,
          isRead: false,
          createdAt: new Date()
        });
      }
    });

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit("getOnlineUsers", onlineUsers);
    });
  });
};

initializeSocket()
