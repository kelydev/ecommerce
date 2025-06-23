import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nombre: { type: String, require: true },
  apellido: { type: String, require: true },
  edad: { type: Number, require: true },
  dni: { type: String, require: true, unique: true },
  curso: { type: String, require: true },
  nota: { type: Number, require: true },
});

export const UserModel = mongoose.model("estudiantes", userSchema, "Saiyan");
