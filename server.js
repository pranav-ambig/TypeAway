const express = require('express');
const { jsonc } = require('jsonc');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.port || 3000;


app.use(express.static(__dirname))


app.get('/player', (req, res)=>{
  playerPresent = true;
  res.sendFile(__dirname+'/forPlayer.html')
  // console.log(req.hostname)
})

app.get('/', (req, res)=>{
  res.sendFile(__dirname+'/forTower.html')
})

app.get('/tower', (req, res)=>{
  res.sendFile(__dirname+'/forTower.html')
})

// app.get('/', (req, res)=>{
//   if (!playerPresent){
//     res.sendFile(__dirname+'/forPlayer.html')
//     console.log('player joined')
//     playerPresent = true
//   }
//   else{
//     console.log('tower joined')
//     res.sendFile(__dirname+'/forTower.html')
//   }

//   // res.send("Go to /player for player, /tower for tower")
// })

// app.get('/tower', (req, res)=>{
//   res.sendFile(__dirname+'/forTower.html')
//   // io.emit("tower-spawn", req.params["tname"])
//   // console.log('test', req.params["tname"])
// })

let rids = {};
let names = {};

io.on('connection', (socket)=>{
  // console.log('connected')

  
  // console.log(socket)
  let strSocket = jsonc.stringify(socket)

  let intervalID = setInterval(()=>{
    if (socket.disconnected){
      // console.log('disconnected')
      // console.log(names[strSocket])
      io.to(rids[strSocket]).emit("tower-despawn", names[strSocket])
      delete rids[strSocket]
      delete names[strSocket]
      clearInterval(intervalID)
      delete socket
    }
  }, 50)

  socket.on("join-room-player", rid=>{
    // console.log(data)
    if (rid != ""){
      socket.join(rid)
      rids[strSocket] = rid
    }
  })

  socket.on("join-room", data=>{
    let rid = data[0]
    let name = data[1]
    // console.log(data)
    if (rid != "" && name != ""){
      socket.join(rid)
      // let dto = {"socket":socket}  
      rids[strSocket] = rid
      names[strSocket] = name
      // console.log(rids)
    }
  })

  socket.on("msg", (objs)=>{
    // Object.entries(rids).forEach(e=>console.log(count, e[1]))
    // count += 1
    
    // let strSocket = jsonc.stringify(socket)
    io.to(rids[strSocket]).emit("msg", objs)
    
  })

  socket.on("level", (objs)=>{
    // let strSocket = jsonc.stringify(socket)
    io.to(rids[strSocket]).emit("level", objs)
  })

  socket.on("name-event", msg=>{
    // let strSocket = jsonc.stringify(socket)
    io.to(rids[strSocket]).emit("tower-spawn", msg)
  })

  socket.on("fire", msg=>{
    // let strSocket = jsonc.stringify(socket)
    io.to(rids[strSocket]).emit("fire", msg)
    // console.log(msg, "fired")
  })

  socket.on("died", ()=>{
    // let strSocket = jsonc.stringify(socket)
    io.to(rids[strSocket]).emit("died")
  })

  // socket.on("disconnect", ()=>{
  //   // let strSocket = jsonc.stringify(socket)
  //   io.to(rids[strSocket]).emit("disconnect", names[strSocket])
  // })

  socket.on("restart", ()=>{
    // let strSocket = jsonc.stringify(socket)
    io.to(rids[strSocket]).emit("restart")})

})

http.listen(port, '0.0.0.0', () => {
  console.log(`Server running at port:${port}`)
  // console.log(`Player: http://192.168.1.17:${port}/player`);
  // console.log(`Tower: http://192.168.1.17:${port}/tower`);
});