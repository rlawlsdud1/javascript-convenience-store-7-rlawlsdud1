import StockModel from "./StockModel.js";
import PromotionModel from "./PromotionModel.js";

class LatestStockModel {
  #stockModel;
  #promotionModel;
  #latestStock;

  constructor() {
    this.#stockModel = new StockModel();
    this.#promotionModel = new PromotionModel();
    this.#latestStock = this.#applyPromotions();
  }

  #applyPromotions() {
    const invalidPromotions = this.#promotionModel.invalidPromotions;
    return this.#stockModel.stockList.map((item) => {
      const inapplicablePromotion = invalidPromotions.find(
        (promotion) => promotion.name === item.promotion
      );
      if (inapplicablePromotion) {
        return { ...item, promotion: null };
      }
      return item;
    });
  }

  #processPromotionStock(productName, remainingQuantity) {
    const promotionProducts = this.#latestStock.filter(
      (item) => item.name === productName && item.promotion
    );

    promotionProducts.forEach((product) => {
      if (product.quantity >= remainingQuantity) {
        product.quantity -= remainingQuantity;
        remainingQuantity = 0;
      } else {
        remainingQuantity -= product.quantity;
        product.quantity = 0;
      }
    });
  }

  #processRegularStock(productName, remainingQuantity) {
    const regularProducts = this.#latestStock.filter(
      (item) => item.name === productName && item.promotion === null
    );

    for (const product of regularProducts) {
      if (product.quantity >= remainingQuantity) {
        product.quantity -= remainingQuantity;
        break;
      } else {
        remainingQuantity -= product.quantity;
        product.quantity = 0;
      }
    }
  }

  updateStockQuantities(products) {
    products.forEach(([productName, _, quantity]) => {
      let remainingQuantity = quantity;

      // 프로모션이 재고부터 차감
      this.#processPromotionStock(productName, remainingQuantity);

      // 남은 수량이 있다면 일반 재고에서 차감
      if (remainingQuantity > 0) {
        this.#processRegularStock(productName, remainingQuantity);
      }
    });
  }

  get latestStock() {
    return this.#latestStock;
  }
}

export default LatestStockModel;
