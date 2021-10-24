const socket = io.connect()

const agregarMensaje = (event) =>{
    event.preventDefault()
    
    const mensaje = {
        author: document.getElementById("authorChat").value,
        text: document.getElementById("textChat").value,
        date: new Date().toLocaleString()
    }

    if(document.getElementById("authorChat").value === "" || document.getElementById("textChat").value === ""){
        alert("Los campos para enviar mensajes estan incompletos")
    } else {
        socket.emit("nuevoMensaje", mensaje)

        document.getElementById("textChat").value = ""
    }
    
}

const formularioChat = document.getElementsByClassName("formularioChat")
formularioChat[0].addEventListener("submit", agregarMensaje)

const agregarProducto = (event) =>{
    event.preventDefault()

    const producto = {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value
    }

    if(document.getElementById("title").value === "" || document.getElementById("price").value === "" || document.getElementById("thumbnail").value === ""){
        alert("Los campos para cargar el producto estan incompletos")
    } else {
        socket.emit("nuevoProducto", producto)

        document.getElementById("title").value = ""
        document.getElementById("price").value = ""
        document.getElementById("thumbnail").value = ""
    }
}

const formularioProducto = document.getElementsByClassName("formularioProducto")
formularioProducto[0].addEventListener("submit", agregarProducto)

socket.on("mensajes", data =>{
    const mensajesHtml = data.map( mensajes => {
        return(`
            <div class="burbujaChat">
                <strong class="email">${mensajes.author} <span class="fecha">[${mensajes.date}]</span>: </strong>
                <span class="letraMensaje">${mensajes.text}</span>
            </div>
        `)
    }).join(" ")

    const listaMensajesHtml = document.getElementsByClassName("mensajes")
    listaMensajesHtml[0].innerHTML = `${mensajesHtml}`
    listaMensajesHtml[0].scrollTop = listaMensajesHtml[0].scrollHeight
})

socket.on("productos", data =>{
    const productosHtml = data.map(producto =>{
        return(`
            <tr>
                <td>${producto.title}</td>
                <td>${producto.price}</td>
                <td><img src="${producto.thumbnail}" width="50" height="50"></td>
            </tr>
        `)
    }).join(" ")

    const listaProductosHtml = document.getElementsByClassName("productosTabla")
    listaProductosHtml[0].innerHTML = `${productosHtml}`
})

