import mongoose from "mongoose"

const cartCollection = "carts"

const cartSchema = new Schema({
  products: [
    {
      product: {
        type: String,
        ref: "products"
      },
      quantity: Number,
    }
  ]
})

cartSchema.pre("find", function() {
  this.populate("products.product")
})

export const cartModel = model(cartCollection, cartSchema)
