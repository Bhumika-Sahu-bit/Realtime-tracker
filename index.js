const express = require("express");
const path = require("path");
const app = express();

//setup for socket.io
const http = require("http");

const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

//ejs setup
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

io.on("connection", function (socket) {
    socket.on("send-location" , function (data , err){
        io.emit("receive-location",{ id: socket.id , ...data })
        if(err){
            console.log(err)
        }else{
            console.log(data)
        }
    }); //socket.io se hum hamari location backend ko bhej tha hai phir backend se hum hamara data hamare sare connection tak bhej the hai
    
    socket.on("disconnect", function(){
        io.emit("user-disconnected", socket.id);
    });
})
app.get("/", (req,resp) => {
    resp.render("index")
})

server.listen(3000);