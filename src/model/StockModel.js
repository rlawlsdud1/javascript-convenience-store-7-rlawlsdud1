import { readFileSync } from "fs";

class StockModel {
  #stockList;

  constructor() {
    this.#stockList = this.#readDataFile("./public/products.md");
  }

  #readDataFile(filePath) {
    try {
      const data = readFileSync(filePath, "utf8");
      return this.#parseData(data);
    } catch (error) {
      console.error(error);
    }
  }

  #parseData(data) {
    const lines = data.trim().split("\n");
    const headers = lines[0].trim().split(",");

    return lines.slice(1).map((line) => {
      const values = line.trim().split(",");
      return this.#createStockObj(headers, values);
    });
  }

  #createStockObj(headers, values) {
    const obj = {};

    for (let i = 0; i < headers.length; i++) {
      obj[headers[i]] = this.#parseValue(headers[i], values[i]);
    }

    return obj;
  }

  #parseValue(header, value) {
    if (header === "price" || header === "quantity") {
      if (value === "재고 없음") {
        return 0;
      }
      return Number(value);
    }
    if (value === "null") {
      return null;
    }
    return value;
  }

  get stockList() {
    return this.#stockList;
  }
}

export default StockModel;
