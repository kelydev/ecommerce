import { Router } from "express";
import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const carts = await CartModel.find().populate('products.product');
    res.json({ message: "Carritos obtenidos", carts });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al consultar carritos", 
      error: error.message 
    });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate('products.product');
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    res.json({ message: "Carrito encontrado", cart });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al buscar carrito", 
      error: error.message 
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = await CartModel.create({ products: [] });
    res.status(201).json({ 
      message: "Carrito creado exitosamente", 
      cart: newCart 
    });
  } catch (error) {
    res.status(400).json({ 
      message: "Error al crear el carrito", 
      error: error.message 
    });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    const product = await ProductModel.findById(pid);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    const existingProductIndex = cart.products.findIndex(
      item => item.product.toString() === pid
    );

    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    
    const updatedCart = await CartModel.findById(cid).populate('products.product');
    
    res.json({ 
      message: "Producto agregado al carrito", 
      cart: updatedCart 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al agregar producto al carrito", 
      error: error.message 
    });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    cart.products = cart.products.filter(
      item => item.product.toString() !== pid
    );

    await cart.save();
    
    const updatedCart = await CartModel.findById(cid).populate('products.product');
    
    res.json({ 
      message: "Producto eliminado del carrito", 
      cart: updatedCart 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al eliminar producto del carrito", 
      error: error.message 
    });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({ 
        message: "Products debe ser un arreglo" 
      });
    }

    for (const item of products) {
      const product = await ProductModel.findById(item.product);
      if (!product) {
        return res.status(404).json({ 
          message: `Producto ${item.product} no encontrado` 
        });
      }
    }

    const updatedCart = await CartModel.findByIdAndUpdate(
      cid,
      { products },
      { new: true, runValidators: true }
    ).populate('products.product');

    if (!updatedCart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.json({ 
      message: "Carrito actualizado", 
      cart: updatedCart 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al actualizar carrito", 
      error: error.message 
    });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ 
        message: "La cantidad debe ser un número mayor a 0" 
      });
    }

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    const productIndex = cart.products.findIndex(
      item => item.product.toString() === pid
    );

    if (productIndex === -1) {
      return res.status(404).json({ 
        message: "Producto no encontrado en el carrito" 
      });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    const updatedCart = await CartModel.findById(cid).populate('products.product');

    res.json({ 
      message: "Cantidad actualizada", 
      cart: updatedCart 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al actualizar cantidad", 
      error: error.message 
    });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const updatedCart = await CartModel.findByIdAndUpdate(
      cid,
      { products: [] },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.json({ 
      message: "Todos los productos eliminados del carrito", 
      cart: updatedCart 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al vaciar carrito", 
      error: error.message 
    });
  }
});

export default router; 