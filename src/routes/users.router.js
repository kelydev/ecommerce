import { Router } from "express";
import { UserModel } from "../models/user.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(201).json({ message: "Success", users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al consultar usuarios", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "usuario no encontrado" });
    }
    res.status(201).json({ message: "Usuario encontrado:", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar usuario", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newUser = await UserModel.create(req.body);
    res.status(201).json({ message: "Usuario creado exitosamente", newUser });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al crear el usuario", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "No se encontro usuario" });
    }
    res.json({ message: "Usuario actualizado", user: updated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar usuario", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleteUser = await UserModel.findByIdAndDelete(req.params.id);
    if (!deleteUser) {
      return res
        .status(404)
        .json({ message: "No se pudo encontrar usuario para eliminar" });
    }
    res
      .status(201)
      .json({ message: "Usuario eliminado exitosamente", user: deleteUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar usuario", error: error.message });
  }
});

export default router;
