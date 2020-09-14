const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require("./utils/messages");
const {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers,
} = require("./utils/users");

const indexRoutes = require("./routes/index");
const chatRoutes = require("./routes/chat");

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

const botName = "Bot";

io.on("connection", socket => {
	socket.on("joinRoom", ({ nickname, room }) => {
		const user = userJoin(socket.id, nickname, room);
		socket.join(user.room);
		//socket.emit --> this message goes to the user who joins
		//Welcome current user
		socket.emit(
			"message",
			formatMessage(botName, "Welcome to <Chat feature name here>!")
		);

		//socket.broadcast --> this message goes to all the users except the user who joins
		//Broadcast when a user connects
		socket.broadcast
			.to(user.room)
			.emit(
				"message",
				formatMessage(botName, `${user.nickname} has joined the chat`)
			);

		//send users and room info
		io.to(user.room).emit("roomUsers", {
			room: user.room,
			users: getRoomUsers(user.room),
		});
	});

	//io.emit --> goes to everyone
	//runs when client disconnects
	socket.on("disconnect", () => {
		const user = userLeave(socket.id);

		if (user) {
			io.to(user.room).emit(
				"message",
				formatMessage(botName, `${user.nickname} has left the chat`)
			);
			//send users and room info
			io.to(user.room).emit("roomUsers", {
				room: user.room,
				users: getRoomUsers(user.room),
			});
		}
	});

	//Listen for chat message
	socket.on("chatMessage", msg => {
		const user = getCurrentUser(socket.id);
		if (user) {
			io.to(user.room).emit("message", formatMessage(user.nickname, msg));
		}
	});
});

app.use(indexRoutes);
app.use(chatRoutes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
});
