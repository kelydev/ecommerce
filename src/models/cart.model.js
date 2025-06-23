import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }]
});

export const CartModel = mongoose.model("carts", cartSchema); 