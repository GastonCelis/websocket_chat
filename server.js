const express = require("express")
const { Server: HttpServer} = require("http")
const { Server: IoServer} = require("socket.io")

const contenedor = require("./contenedor")
const contenedorProductos = new contenedor("./data/productos.json")
const contenedorMensajes = new contenedor("./data/mensajes.json")

const PORT = 8080
const app = express()
const httpServer = new HttpServer(app)
const io = new IoServer(httpServer)

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(express.static( "./public"))

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname})
})

io.on("connection", async (socket) =>{
    console.log(`Nuevo Usuario Conectado ID: ${socket.id}`)
    

    const mensajes = await contenedorMensajes.getAll()
    socket.emit("mensajes", mensajes)
    socket.on("nuevoMensaje", async data => {
        await contenedorMensajes.save(data)
        const mensajes = await contenedorMensajes.getAll()
        io.sockets.emit("mensajes", mensajes)
    })


    const productos = await contenedorProductos.getAll()
    socket.emit("productos", productos)
    socket.on("nuevoProducto", async data => {
        await contenedorProductos.save(data)
        const productos = await contenedorProductos.getAll()
        io.sockets.emit("productos", productos)
    })
})

httpServer.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`))
httpServer.on('error', (error) => console.log('Error: ', error));