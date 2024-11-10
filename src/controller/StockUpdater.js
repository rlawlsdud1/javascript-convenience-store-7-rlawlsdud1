class StockUpdater {
  #latestStockModel;
  #confirmedProduct;

  constructor(latestStockModel, confirmedProduct) {
    this.#latestStockModel = latestStockModel;
    this.#confirmedProduct = confirmedProduct;
  }

  updateStock() {
    this.#latestStockModel.updateStockQuantities(this.#confirmedProduct);
  }
}

export default StockUpdater;
