const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 8081;


app.use(express.static(__dirname))

app.get('/player', (req, res)=>{
  res.sendFile(__dirname+'/forPlayer.html')
  // console.log(req.hostname)
})

app.get('/tower', (req, res)=>{
  res.sendFile(__dirname+'/forTower.html')
  // io.emit("tower-spawn", req.params["tname"])
  // console.log('test', req.params["tname"])
})

io.on('connection', (socket)=>{
  // console.log('connected')
  socket.on("msg", (objs)=>{
    io.emit("msg", objs)
  })

  socket.on("name-event", msg=>{
    io.emit("tower-spawn", msg)
  })

  socket.on("fire", msg=>{
    io.emit("fire", msg)
    // console.log(msg, "fired")
  })

  socket.on("died", ()=>{
    io.emit("died")
  })

  socket.on("restart", ()=>io.emit("restart"))

})

http.listen(port, '0.0.0.0', () => {
  console.log(`Player: http://192.168.214.161:${port}/player`);
  console.log(`Tower: http://192.168.214.161:${port}/tower`);
});