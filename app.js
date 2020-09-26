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
var firebase = require("firebase");

// Add the Firebase products that you want to use
var config = {
	apiKey: "AIzaSyDQ-2fHSstjagBY9anA4am5Ek9bYxEgHGw",
	authDomain: "enactus-iiitd-website.firebaseapp.com",
	databaseURL: "https://enactus-iiitd-website.firebaseio.com",
	projectId: "enactus-iiitd-website",
	storageBucket: "enactus-iiitd-website.appspot.com",
	messagingSenderId: "578304334099",
	appId: "1:578304334099:web:96ce6ce07fd1aca06ea2e6",
	measurementId: "G-VDSF50HYSX"
};
firebase.initializeApp(config);


const indexRoutes = require("./routes/index");
const chatRoutes = require("./routes/chat");
const { time } = require("console");

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

		// Show chat history of the room connected to 
		firebase.database().ref(user.room).child("messages").once("value", function(snapshot) {
			firebase.database().ref(user.room).child("messages").child(snapshot.numChildren()).once("value", function(snapshot2){
				snapshot.forEach(function(childSnapshot) {
					// Need to add time also, shows the time the message gets broadcasted for now
					io.to(user.room).emit("message", formatMessage(childSnapshot.val().sentByNickname, childSnapshot.val().message));
				});

			}).catch((e) => {
				console.log(e);
			});
		}).catch((e) => {
			console.log(e);
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
			
			// Storing the message in firebase
			firebase.database().ref(user.room).child("messages").once("value", function(snapshot) {
				firebase.database().ref(user.room).child("messages").child(snapshot.numChildren()).once("value", function(snapshot2) {
					firebase.database().ref(user.room).child("messages").child(snapshot.numChildren()).update({
						message: msg,
						sentByNickname: user.nickname,
						// Need to get time the message is sent to store on database
						// messageTime: timeOfMesage
					}).catch((e) => {
						console.log(e);
					});
				}).catch((e) => {
					console.log(e);
				});
			});
			
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
