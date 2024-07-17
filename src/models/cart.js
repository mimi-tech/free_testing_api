const mongoose = require("mongoose");

const cart = new mongoose.Schema(
  {
    authId: {
        type: String,
        required: [true, "sender must have id"],
      },
     

      email: {
        type: String,
        required: [true, "Customer email is required"],
      },

    productId: {
      type: String,
      required: [true, "Product Id must be provided"],
    },

    productTitle: {
        type: String,
        required: [true, "Product title must be provided"],
      },

    productDescription: {
      type: String,
      required: [true, "Product description must be provided"],
    },

    productImage: {
        type: String,
        required: [true, "Product Image must be provided"],
      },

      productPrice: {
        type: Object,
        required: [true, "Product price must be provided"],
      },

      productCategory: {
        type: Object,
        required: [true, "Product category must be provided"],
      },

    
      
      createdAt: {
        type: Date,
        default: new Date()
      }

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Cart = mongoose.model("cart", cart);

module.exports = Cart;
