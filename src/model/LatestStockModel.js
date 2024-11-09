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

  get latestStock() {
    return this.#latestStock;
  }
}

export default LatestStockModel;
