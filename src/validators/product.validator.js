//import productServices from "../services/product.services.js"
import { ProductService as productServices } from "../repositories/index.js";

class productValidator {

  async getProducts(limit, query, sort, page) {
    try {
      const products = await productServices.find(limit, query, sort, page)
      return products
    } catch (error) {
      return error;

    }
  }

  async getProductById(pid) {
    try {
      const products = await productServices.findById(pid)
      return products
    } catch (error) {
      return error
    }
  }

  async createProduct(title, description, category, price, thumbnailName, code, stock) {
    try {
      if (!title || !description || !category || !price || !thumbnailName || !code || !stock) {
        throw new Error("Falta completar campos")
      }
      await productServices.createProduct(title, description, category, price, thumbnailName, code, stock)
    } catch (error) {
      return error;
    }
  }

  async editProduct(pid, updatedProduct) {
    try {
      if (!pid) throw new Error("Missing Product Id")
      if(updatedProduct.code) throw new Error("Campo code no se puede modificar")
      await productServices.editProduct(pid,newProduct)
    } catch (error) {
      return error;
    }
  }


  async deleteProduct(pid) {
    try {
      if (!pid) throw new Error("Missing product Id")
      await productServices.deleteProduct(pid)
    } catch (error) {
      return error;
    }
  }


}


export default new productValidator()

