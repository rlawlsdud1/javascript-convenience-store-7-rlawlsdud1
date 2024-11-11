import {
  SHOPPING_ERROR_MESSAGES,
  SPECIAL_CHARACTER,
} from "../constants/Constants.js";

class ProductValidation {
  static #validateInputFormat(productToPurchase) {
    const parsedProduct = [];
    const productSplitedByCommas = productToPurchase.split(
      SPECIAL_CHARACTER.COMMA
    );
    productSplitedByCommas.map((prod) => {
      this.#parseProductData(prod.trim(), parsedProduct);
    });
    return parsedProduct;
  }

  // 우선적으로 [] 로 감싸져 있는지만 확인하고,
  // 그렇다면 상품명은 공백제거하고, 수량은 number로 형변환한다.
  // [] 로 감싸져 있지 않으면 ERROR
  static #parseProductData(prod, parsedProduct) {
    if (this.#isBracketed(prod)) {
      const [product, quantity] = this.#splitByDash(prod.slice(1, -1));
      if (!product.trim().length) {
        throw new Error(SHOPPING_ERROR_MESSAGES.INVALID_FORMAT);
      }
      parsedProduct.push([product.trim(), Number(quantity)]);
    } else {
      throw new Error(SHOPPING_ERROR_MESSAGES.INVALID_FORMAT);
    }
  }

  static #isBracketed(product) {
    if (
      product.startsWith(SPECIAL_CHARACTER.LEFT_BRACKET) &&
      product.endsWith(SPECIAL_CHARACTER.RIGHT_BRACKET)
    ) {
      return true;
    }
    return false;
  }

  static #splitByDash(product) {
    return product.split(SPECIAL_CHARACTER.DASH);
  }

  static #validateProductName(parsedProduct, latestStock) {
    parsedProduct.forEach((prod) => {
      const productName = prod[0];
      const productExists = latestStock.find(
        (item) => item.name === productName
      );
      if (!productExists) {
        throw new Error(SHOPPING_ERROR_MESSAGES.INVALID_PRODUCT_NAME);
      }
    });
  }

  static #validateQuantityFormat(parsedProduct) {
    return parsedProduct.every((prod) => {
      const quantity = prod[1];
      return Number.isInteger(quantity) && quantity > 0;
    });
  }

  static #validateQuantityExceeded(parsedProduct, latestStock) {
    for (let product of parsedProduct) {
      const productName = product[0];
      const quantity = product[1];
      const totalQuantity = this.#getProductQuantity(productName, latestStock);

      if (quantity > totalQuantity) {
        return false;
      }
    }
    return true;
  }

  static #getProductQuantity(productName, latestStock) {
    const filteredStock = latestStock.filter(
      (stock) => stock.name === productName
    );

    const totalQuantity = filteredStock.reduce((total, stock) => {
      return total + stock.quantity;
    }, 0);

    return totalQuantity;
  }

  static #validateQuantity(parsedProduct, latestStock) {
    if (!this.#validateQuantityFormat(parsedProduct)) {
      throw new Error(SHOPPING_ERROR_MESSAGES.INVALID_FORMAT);
    }
    if (!this.#validateQuantityExceeded(parsedProduct, latestStock)) {
      throw new Error(SHOPPING_ERROR_MESSAGES.QUANTITY_EXCEEDED);
    }
  }

  static #validateDuplicateProductNames(parsedProduct) {
    const productNames = [];
    for (let product of parsedProduct) {
      const productName = product[0];
      productNames.push(productName);
    }
    if (new Set(productNames).size !== productNames.length) {
      throw new Error(SHOPPING_ERROR_MESSAGES.UNEXPECTED_ERROR);
    }
  }

  static validateProductToPurchase(productToPurchase, latestStock) {
    const parsedProduct = this.#validateInputFormat(productToPurchase);
    this.#validateDuplicateProductNames(parsedProduct);
    this.#validateProductName(parsedProduct, latestStock);
    this.#validateQuantity(parsedProduct, latestStock);
    return parsedProduct;
  }
}

export default ProductValidation;
