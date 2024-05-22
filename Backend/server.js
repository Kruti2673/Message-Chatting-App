const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
dotenv.config({ path: "./config.env" });

const path = require("path");

const { Server } = require("socket.io");

//for exception
process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1); //shutdown database
});

const http = require("http");
const User = require("./models/user");
const FriendRequest = require("./models/friendRequest");
const OneToOneMessage = require("./models/OneToOneMessage");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//connection to database
//const DB = process.env.DBURI.replace("<PASSWORD", process.env.DBPASSWORD);
// mongoose
//   .connect(process.env.DBURI, {
//     //useNewUrlParser: true,
//     //useUnifiedTopology: true,
//   })
//   .then((con) => {
//     console.log("DB connection is successfully");
//   })
//   .catch((err) => {
//     console.log(err);
// });
app.use(cors());
async function startServer() {
  //console.log(process.env.DBURI);
  mongoose
    .connect(process.env.DBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      //useFindAndModify: false,
    })
    .then((result) => {
      console.log("Server started at " + 5000);
    })
    .catch((err) => {
      console.log("Error++", err);
    });
}

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("hello world");
});

server.listen(port, () => {
  console.log(`App running on port ${port}`);
});

startServer();

io.on("connection", async (socket) => {
  //console.log(JSON.stringify(socket.handshake.query));
  //console.log(socket);
  const user_id = socket.handshake.query["user_id"];

  const socket_id = socket.id;
  console.log(`User connected ${socket_id}`);

  if (Boolean(user_id)) {
    await User.findByIdAndUpdate(user_id, { socket_id, status: "Online" });
  }
  //We can write our socket event listeners here...

  socket.on("friend_request", async (data) => {
    console.log(data.to);

    //{to:"987654"}

    const to_user = await User.findById(data.to).select("socket_id");
    const from_user = await User.findById(data.to).select("socket_id");

    await FriendRequest.create({
      sender: data.from,
      recipient: data.to,
    });

    //create a friend request
    io.to(to_user.socket_id).emit("new_friend_request", {
      //
      message: "New Friend Request Received",
    });
    io.to(from_user.socket_id).emit("request_sent", {
      //
      message: "Request sent successfully",
    });
  });

  socket.on("accept_request", async (data) => {
    console.log(data);

    const request_doc = await FriendRequest.findById(data.request_id);

    console.log(request_doc);

    const sender = await User.findById(request_doc.sender);
    const receiver = await User.findById(request_doc.recipient);

    sender.friends.push(request_doc.recipient);
    receiver.friends.push(request_doc.sender);

    await receiver.save({ new: true, validateModifiedOnly: true });
    await server.save({ new: true, validateModifiedOnly: true });

    await FriendRequest.findByIdAndDelete(data.request_id);

    io.to(sender.socket_id).emit("request_accepted", {
      message: "Friend Request Accepted",
    });

    io.to(receiver.socket_id).emit("request_accepted", {
      message: "Friend Request Accepted",
    });
  });

  socket.on("get_direct_conversations", async ({ user_id }, callback) => {
    const existing_conversation = await OneToOneMessage.find({
      participants: { $all: [user_id] },
    }).populate("participants", "firstName lastName _id email status");

    console.log(existing_conversation);

    callback(existing_conversation);
  });

  socket.on("start_conversation", async (data) => {
    const { to, from } = data;
    const existing_conversation = await OneToOneMessage.find({
      participants: { $size: 2, $all: [to, from] },
    }).populate("participants", "firstName lastName _id email status");

    console.log(existing_conversation[0], "Existing Conversation");

    if (existing_conversation.length === 0) {
      let new_chat = await OneToOneMessage.create({
        participants: [to, from],
      });
      new_chat = await OneToOneMessage.findById(new_chat._id).populate(
        "participants",
        "firstName lastName _id email status"
      );

      console.log(new_chat);

      socket.emit("start_chat", new_chat);
    } else {
      socket.emit("start_chat", existing_conversation[0]);
    }
  });

  socket.on("get_messages", async (data, callback) => {
    const { messages } = await OneToOneMessage.findById(
      data.conversation_id
    ).select("messages");
    callback(messages);
  });

  socket.on("text_message", async (data) => {
    console.log("Received Message", data);

    const { to, from, message, conversation_id, type } = data;

    const to_user = await User.findById(to);
    const from_user = await User.findById(from);

    const new_message = {
      to,
      from,
      type,
      text: message,
      created_at: Date.now(),
    };

    const chat = await OneToOneMessage.findById(conversation_id);
    chat.messages.push(new_message);

    await chat.save({});

    io.to(to_user.socket_id).emit("new_message", {
      conversation_id,
      message: new_message,
    });

    io.to(from_user.socket_id).emit("new_message", {
      conversation_id,
      message: new_message,
    });
  });

  socket.on("file_message", (data) => {
    console.log("Received Message", data);

    const fileExtension = path.extname(data.file.name);

    const fileName = `${Date.now()}_${Math.floor(
      Math.random() * 1000
    )}${fileExtension}`;
  });

  socket.on("end", async (data) => {
    if (data.user_id) {
      await User.findByIdAndUpdate(data.user_id, { status: "Offline" });
    }

    //TODO broadcast user_disconnected

    console.log("Closing connection");
    socket.disconnect(0);
  });
});

//for handle rejection
process.on("unhandledRejection", (err) => {
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
