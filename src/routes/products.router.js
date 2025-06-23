import { Router } from "express";
import { ProductModel } from "../models/product.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    
    let filter = {};
    if (query) {
      if (query === "available") {
        filter.status = true;
      } else if (query === "unavailable") {
        filter.status = false;
      } else {
        filter.category = new RegExp(query, 'i');
      }
    }

    let sortOption = {};
    if (sort) {
      if (sort === "asc") {
        sortOption.price = 1;
      } else if (sort === "desc") {
        sortOption.price = -1;
      }
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOption
    };

    const result = await ProductModel.paginate(filter, options);

    const response = {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: "Error al consultar productos", 
      error: error.message 
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: "Producto encontrado", product });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al buscar producto", 
      error: error.message 
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = await ProductModel.create(req.body);
    res.status(201).json({ 
      message: "Producto creado exitosamente", 
      product: newProduct 
    });
  } catch (error) {
    res.status(400).json({ 
      message: "Error al crear el producto", 
      error: error.message 
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await ProductModel.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: "Producto actualizado", product: updated });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al actualizar producto", 
      error: error.message 
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ 
        message: "Producto no encontrado para eliminar" 
      });
    }
    res.json({ 
      message: "Producto eliminado exitosamente", 
      product: deletedProduct 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al eliminar producto", 
      error: error.message 
    });
  }
});

export default router; 