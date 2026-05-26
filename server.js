const express = require("express");

const http = require("http");

const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {

    console.log("User Connected");

    socket.on("join-room", (room) => {

        socket.join(room);

        socket.to(room).emit("user-joined");

        socket.on("offer", (offer) => {

            socket.to(room).emit("offer", offer);

        });

        socket.on("answer", (answer) => {

            socket.to(room).emit("answer", answer);

        });

        socket.on("candidate", (candidate) => {

            socket.to(room).emit("candidate", candidate);

        });

        socket.on("disconnect", () => {

            socket.to(room).emit("user-left");

        });

    });

});

server.listen(3000, () => {

    console.log("Server Running On Port 3000");

});