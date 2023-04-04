import twilio from "twilio"
import config from "../config/config.js";

import { CartsService as cartsServices, ProductService } from "../repositories/index.js"


class cartsValidator {

  async getCarts(limit) {
    try {
      const carts = await cartsServices.find(limit)
      return carts
    } catch (error) {
      return error;

    }
  }

  async getCartById(cid) {
    try {
      const carts = await cartsServices.findById(cid)
      return carts
    } catch (error) {
      return error
    }
  }

  async createCart(cart) {
    try {
      await cartsServices.createCart(cart)
    } catch (error) {
      return error;
    }
  }

  async updateCart(cid, product) {
    //chequeando productos en bd
   let enExistencia = await productServices.findById(product.product)
    try {
      if (!cid) throw new Error("Missing CID")
      if (!enExistencia) throw new Error("Product not found in DB")
      
      await cartsServices.updateCart(cid,product)
    } catch (error) {
      return error;
    }
  }

  async updateQuantityFromCart(cid,pid, quantity) {
    try {
      if (!cid) throw new Error("Missing CID")
      if (!pid) throw new Error("Missing PID")
      if (!quantity) throw new Error("Missing QUANTITY")
      await cartsServices.updateQuantityToCart(cid,pid,quantity) } catch (error) {
      return error;
    }
  }



  async deleteProductFromCart(cid,pid) {
    try {
      if (!pid) throw new Error("Missing PID")
      if (!cid) throw new Error("Missing CID")
      await cartsServices.deleteProductFromCart(cid,pid)
    } catch (error) {
      return error;
    }
  }


  async emptyCart(cid) {
    try {
      if (!cid) throw new Error("Missing CID")
      await cartsServices.emptyCart(cid)
    } catch (error) {
      return error;
    }
  }

  async purchase(cid, user) {

    const client = twilio(config.twilio_account, config.twilio_token)
    const cartInExistence = await cartsServices.getCartById(cid)
    if (!cartInExistence) throw new Error("Missing Cart Id")
    if (!user) throw new Error("Missing user")
    if (cartInExistence.products.length === 0) throw new Error("No products in the cart")

    try {


      const cartToModify = cartInExistence;
      let newListProducts = []
      let amount = 0;

      cartToModify.products.forEach(async (product) => {

        let productToUpdate = product.product._id.toHexString()



        if (product.quantity === product.product.stock) { // Si el stock y la cantidad necesitada es igual, tenemos que sacar eso del carrito original cliente y pasarlo al ticket

          newListProducts.push(product) // Agregamos los productos que cumplieron las condiciones
          amount += product.quantity * product.product.price
          await cartsServices.deleteProductFromCart(cid, (product._id).toHexString())
          await ProductService.updateProduct(productToUpdate, { stock: 0 }) // Descontamos del stock de la DB


        } else if (product.quantity <= product.product.stock) {


          let newProductQuantity = product.product.stock - product.quantity // Calculamos que es lo que nos queda del stock original
          amount += product.quantity * product.product.price
          newListProducts.push(product) // Agregamos los productos que cumplieron las condiciones
          await ProductService.updateProduct(productToUpdate, { stock: newProductQuantity }) // Descontamos del stock de la DB
          await cartsServices.deleteProductFromCart(cid, (product._id).toHexString())


        }

      })


      let code = Math.random().toString(36).slice(2, 27)
      const ticket = {
        cart: newListProducts,
        purchaser: user.user,
        amount: amount,
        code: code

      }


      await cartsServices.purchase(ticket)


      let unOrderedProducts = await cartsServices.getCartById(cid)

      client.messages.create({
        body: 'Has realizado una compra',
        from: config.twilio_number,
        to: '+541167435985' // EN EL TELEFONO SIEMPRE AGREGAR EL PREFIJO +54, SI NO, NO LO VA A TOMARK
      })
      return { ticket: ticket, unOrderedProducts: unOrderedProducts, message: "Los productos no agregados son aquellos que superan las cantidades de stock disponible" };


    } catch (error) {
      return error

    }

  }

}

export default new cartsValidator()