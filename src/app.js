import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Importar routers
import userRouter from "./routes/users.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// llamado a la configuracion de variable de entorno
dotenv.config();

const app = express();

// Configurar Handlebars con helpers
app.engine("handlebars", engine({
  helpers: {
    multiply: function(a, b) {
      return a * b;
    }
  }
}));
app.set("view engine", "handlebars");
app.set("views", join(__dirname, "views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));

// guardamos en variable la variable de entorno (.ENV)
const URL_MONGO = process.env.MONGO_URI;

// configuracion a conexion a base de datos en Mongo Atlas
mongoose
  .connect(URL_MONGO, {
    dbName: "Coders_app", // nombre de la base de datos, si no se especifica por defecto sera 'test'
  })
  .then(() => console.log("Conectado a la base de datos"))
  .catch((err) => console.log("Error al conectarse a la BD", err));

// Rutas API
app.use("/api/users", userRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Rutas de vistas
app.use("/", viewsRouter);

// escucha del servidor
app.listen(8080, () => console.log("Servidor corriendo en puerto: 8080"));
