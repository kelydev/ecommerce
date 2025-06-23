import { Router } from "express";
import { ProductModel } from "../models/product.model.js";
import { CartModel } from "../models/cart.model.js";

const router = Router();

router.get("/products", async (req, res) => {
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
    if (sort === "asc") {
      sortOption.price = 1;
    } else if (sort === "desc") {
      sortOption.price = -1;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOption,
      lean: true
    };

    const result = await ProductModel.paginate(filter, options);

    const response = {
      products: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null,
      nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null
    };

    res.render("index", response);
  } catch (error) {
    res.status(500).send("Error al cargar productos");
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).lean();
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }
    res.render("product-detail", { product });
  } catch (error) {
    res.status(500).send("Error al cargar producto");
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid)
      .populate('products.product')
      .lean();
    
    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    let total = 0;
    cart.products.forEach(item => {
      total += item.product.price * item.quantity;
    });

    res.render("cart", { cart, total });
  } catch (error) {
    res.status(500).send("Error al cargar carrito");
  }
});

export default router; 