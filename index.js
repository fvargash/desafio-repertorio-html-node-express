const express = require('express') //llampo al modulo
const app = express() //ejecuto la funcion express y la guardo en la constante app que finalmente me crea una aplicacion

//al añadir una cancion me sale un error, no se estan agregando las canciones, debemos poder leer el body porque es quien nos aparece ubdefined (req.body), por lo que tenemos que para que deje de ser undefined debemos usar 'app.use' que es para utilizar cualquier middleware
app.use(express.json()) //es un paso necesario para leer el body en express correctamente, ahora se agregan a la lista las nuevas canciones correctamente

const fs = require('fs')

app.listen(3000, () => {                //listen levanta el servidor y lo deja escuchando, definimos el puerto del servidor y su callback
    console.log('Servidor iniciado') 
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html')          //respondemos enviando el archivo a la ruta '/', con'__dirname devolvemos el directorio donde estas y donde se esta ejecutando el script '+' el nombre el archivo, en este caso, 'index.html'
})      //construimos la ruta para ver el archivo frontend index.html para poder asociarlo correctamente al servidor(deberiamos poder ver la pagina index.html en localhost:3000)

//ahora queremos ver en la pagina index.html las verdaderas canciones que tengo en mi repertorio.json (de momento no las vemos)
//las canciones que ya estan en el json deberian estar sirviendose en '/canciones' por eso debo enurtar, leer y responder el json que tenemos
//los campos del index deben coincidir con los de mi json porque cunado se procesa en el servidor se espera que sean iguales sino dira undefined
//teniamos de respuesta solo un mensaje por lo que completaremos con lo que falta
app.get('/canciones', (req, res) => {        //enrutamos el servidor
    const  canciones = JSON.parse(fs.readFileSync('repertorio.json'))
    res.json(canciones)
})

app.post('/canciones', (req,res) => {       
    const cancion = req.body    //payload, cuerpo de la consulta, el body que viene cuando se hace post
    const canciones = JSON.parse(fs.readFileSync('repertorio.json')) //leemos el  json 
    
    canciones.push(cancion) //agregamos al arreglo las canciones
    fs.writeFileSync('repertorio.json', JSON.stringify(canciones)) //escribimos las canciones y las transformamos en json
    res.send('Cancion añadida exitosamente') //enviamos una respuesta a la request 
}) //para probarlo en el servidor y poder agregar las canciones debemos asociar el servidor backend con el index.htm frontend para asociarlos y poder llenar los campos y enviarlos correctamente a nuestro servidor y que funcione correctamente, como necesito ver el archivo en mi navegador generaremos una ruta con 'app.get'

app.put('/canciones/:id', (req, res) => {
    const { id } = req.params 
    const cancion = req.body
    const canciones = JSON.parse(fs.readFileSync('repertorio.json'))
    const index = canciones.findIndex(cancion => cancion.id == id)
    canciones[index] = cancion
    fs.writeFileSync('repertorio.json', JSON.stringify(canciones))
    res.send('cancion modificada con exito')
})

app.delete('/canciones/:id', (req, res) => {
    const { id } = req.params
    const canciones = JSON.parse(fs.readFileSync('repertorio.json'))
    const index = canciones.findIndex(cancion => cancion.id == id)
    canciones.splice(index, 1) //splice recibe el primer argumento es de donde vamos a comenzar a borrar en el caso desde el indice cero y el segundo cuantos elementos voy a borrar en este caso 1 elemento
    fs.writeFileSync('repertorio.json', JSON.stringify(canciones)) 
    res.send('cancion borrada con exito')
}) 