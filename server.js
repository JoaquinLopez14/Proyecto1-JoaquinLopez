// Cargar las variables de entorno del archivo .env
require("dotenv").config();

// Importar el módulo Express
const express = require("express");
const app = express();

// Importar las funciones del gestor de frutas
const { leerFrutas, guardarFrutas } = require("./src/frutasManager");

// Configurar el número de puerto para el servidor
const PORT = process.env.PORT || 3000;

// Crear un arreglo vacío para almacenar los datos de las frutas
let BD = [];

// Configurar el middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Middleware para leer los datos de las frutas antes de cada solicitud
app.use((req, res, next) => {
  BD = leerFrutas(); // Leer los datos de las frutas desde el archivo
  next(); // Pasar al siguiente middleware o ruta
});

// Ruta principal que devuelve los datos de las frutas
app.get("/", (req, res) => {
   res.send(BD);
});

// Ruta para buscar un fruta por ID
app.get("/frutas/:id", (req, res) => {
  let id = parseInt(req.params.id);
  const fruta = BD.find(i => i.id === id);

  if (fruta) {
    res.send(fruta);
  } else {
    res.status(404).send("Fruta no encontrada");
  }
});

// Ruta para modificar frutas 
app.put("/frutas/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let datosProducto = req.body;
  let index = BD.findIndex((fruta) => fruta.id === id);

  if (index >= 0) {
    BD[index] = Object.assign({}, BD[index], datosProducto);
    guardarFrutas(BD);
    res.send("Fruta modificada");
  } else {
    res.status(404).send("Fruta no encontrada");
  }
});

// Ruta para eliminar una fruta
app.delete("/frutas/:id", (req, res) => {
  let id = parseInt(req.params.id);

  let index = BD.findIndex((fruta) => fruta.id === id);

  if (index >= 0) {
    BD.splice(index, 1);
    guardarFrutas(BD);
    res.send("Fruta eliminada");
  } else {
    res.status(404).send("Fruta no encontrada");
  }
});

// Ruta para agregar una nueva fruta al arreglo y guardar los cambios
app.post("/", (req, res) => {
    const nuevaFruta = req.body;
    BD.push(nuevaFruta); // Agregar la nueva fruta al arreglo
    guardarFrutas(BD); // Guardar los cambios en el archivo
    res.status(201).send("Fruta agregada!"); // Enviar una respuesta exitosa
});

// Ruta para manejar las solicitudes a rutas no existentes
app.get("*", (req, res) => {
  res.status(404).send("Lo sentimos, la página que buscas no existe.");
});


// Iniciar el servidor y escuchar en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
