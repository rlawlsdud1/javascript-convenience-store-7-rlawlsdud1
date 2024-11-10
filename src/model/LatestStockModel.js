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
    const updatedStock = [];

    this.#stockModel.stockList.forEach((item) => {
      const inapplicablePromotion = invalidPromotions.some(
        (promotion) => promotion.name === item.promotion
      );

      if (inapplicablePromotion) {
        const generalStock = updatedStock.find(
          (stock) => stock.name === item.name && !stock.promotion
        );

        if (generalStock) {
          generalStock.quantity += item.quantity;
        } else {
          updatedStock.push({ ...item, promotion: null });
        }
      } else {
        const generalStock = updatedStock.find(
          (stock) => stock.name === item.name && !stock.promotion
        );
        if (generalStock) {
          generalStock.quantity += item.quantity;
        } else {
          updatedStock.push(item);
        }
      }
    });

    return updatedStock;
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
    return remainingQuantity;
  }

  #processRegularStock(productName, remainingQuantity) {
    const regularProducts = this.#latestStock.filter(
      (item) => item.name === productName && item.promotion === null
    );

    for (const product of regularProducts) {
      if (product.quantity >= remainingQuantity) {
        product.quantity -= remainingQuantity;
        return 0; // 모든 재고 차감 완료
      } else {
        remainingQuantity -= product.quantity;
        product.quantity = 0;
      }
    }
    return remainingQuantity;
  }

  updateStockQuantities(products) {
    products.forEach(([productName, _, quantity]) => {
      let remainingQuantity = quantity;

      // 프로모션이 있는 재고부터 차감
      remainingQuantity = this.#processPromotionStock(
        productName,
        remainingQuantity
      );

      // 프로모션 재고에서 다 차감된 후, 남은 수량이 일반 재고에서 차감
      if (remainingQuantity > 0) {
        remainingQuantity = this.#processRegularStock(
          productName,
          remainingQuantity
        );
      }
    });
  }

  get latestStock() {
    return this.#latestStock;
  }
}

export default LatestStockModel;
