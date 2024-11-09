class StockParser {
  static getParsedStock(stocks) {
    return stocks.map((item) => {
      const promotionText = this.#getPromotionText(item);
      const stockText = this.#getStockText(item, promotionText);
      return stockText;
    });
  }

  static #getPromotionText(item) {
    if (item.promotion) {
      return `${item.promotion}`;
    }
    return "";
  }

  static #getStockText(item, promotionText) {
    if (!item.quantity) {
      return `- ${
        item.name
      } ${item.price.toLocaleString()}원 재고 없음 ${promotionText}`;
    }
    return `- ${item.name} ${item.price.toLocaleString()}원 ${
      item.quantity
    }개 ${promotionText}`;
  }
}

export default StockParser;
