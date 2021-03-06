'use strict';
const express   = require('express');
const app       = express();
const http      = require('http');
const server    = http.createServer(app);
const io        = require('socket.io')(server);

const LISTEN_PORT = 8080;

 // Set root dir to the public folder.
app.use((express.static(__dirname + '/public')));

 //Serve the example and build the bundle in development.
if (process.env.NODE_ENV === "development")
{
    const webpackMiddleware = require("webpack-dev-middleware");
    const webpack = require("webpack");
    const config = require("../webpack.dev");

    app.use(
        webpackMiddleware(webpack(config),
        {
            publicPath: "/dist/"
        })
    );
}

const rooms = {};

io.on("connection", socket =>
{
    console.log("User connected", socket.id);

    let curRoom = null;

    socket.on("joinRoom", data =>
    {
        const { room } = data;

        if (!rooms[room])
        {
            rooms[room] = {
                name: room,
                occupants: {},
            };
        }

        const joinedTime = Date.now();
        rooms[room].occupants[socket.id] = joinedTime;
        curRoom = room;

        console.log(`${socket.id} joined room ${room}`);
        socket.join(room);

        socket.emit("connectSuccess", { joinedTime });
        const occupants = rooms[room].occupants;
        io.in(curRoom).emit("occupantsChanged", { occupants });
    });

    socket.on("send", data =>
    {
        io.to(data.to).emit("send", data);
    });

    socket.on("broadcast", data =>
    {
        socket.to(curRoom).broadcast.emit("broadcast", data);
    });

    socket.on("disconnect", () =>
    {
        console.log('disconnected: ', socket.id, curRoom);
        if (rooms[curRoom])
        {
            console.log("user disconnected", socket.id);

            delete rooms[curRoom].occupants[socket.id];
            const occupants = rooms[curRoom].occupants;
            socket.to(curRoom).broadcast.emit("occupantsChanged", { occupants });

            if (occupants == {})
            {
                console.log("Everybody left room");
                delete rooms[curRoom];
            }
        }
    });

    // Game events
    socket.on('ready', function (data)
    {
        socket.broadcast.emit('other_ready', data);
    });

    socket.on('player_score', function (data)
    {
        socket.broadcast.emit('other_score');
    });

    socket.on('player_won', function (data)
    {
        socket.broadcast.emit('other_won', { r: 0, g: 255, b: 0 });
    });
});

server.listen(LISTEN_PORT, () =>
{
    console.log("Listening on http://localhost:" + LISTEN_PORT);
});
