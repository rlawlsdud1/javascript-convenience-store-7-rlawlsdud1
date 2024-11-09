import Input from "../view/Input.js";
import Output from "../view/Output.js";
import ProductValidation from "./ProductValidation.js";
import StockParser from "./StockParser.js";

class ProductSelection {
  #latestStock;
  #parsedStock;

  constructor(latestStockModel) {
    this.#latestStock = latestStockModel.latestStock;
    this.#parsedStock = StockParser.getParsedStock(this.#latestStock);
  }

  showLatestStock() {
    Output.printWelcomeMsg();
    Output.printStocks(this.#parsedStock);
  }

  async getValidProductToPurchase() {
    while (true) {
      const productToPurchase = await Input.requestProductAndQuantity();
      const parsedProduct = this.validateAndReturnProduct(productToPurchase);
      if (parsedProduct) return parsedProduct;
    }
  }

  validateAndReturnProduct(productToPurchase) {
    try {
      return ProductValidation.validateProductToPurchase(
        productToPurchase,
        this.#latestStock
      );
    } catch (error) {
      Output.printErrorMsg(error.message);
    }
  }
}

export default ProductSelection;
