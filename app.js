const express = require("express");
const app = express();
const path = require("path");

const http = require("http");

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

const socketIo = require("socket.io");

const server = http.createServer(app);

const io = socketIo(server);

app.get("/",(req,res)=>{
    res.send("Working");
})

app.get("/map",(req,res)=>{
    res.render("index.ejs");
})

io.on("connection",(socket)=>{
    console.log(`user connected ${socket.id}`);
    socket.on("send-location",(data)=>{
        io.emit("receive-location",{id:socket.id,...data});
    })

    socket.on("disconnect",()=>{
        console.log(`user disconnected ${socket.id}`)
        io.emit("user-disconnected",socket.id);
    })
})


server.listen(8080,()=>{
    console.log("Hey");
})