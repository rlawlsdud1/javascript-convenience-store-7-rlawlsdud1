import { readFileSync } from "fs";
import { DateTimes } from "@woowacourse/mission-utils";

class PromotionModel {
  #promotionList;

  constructor() {
    this.#promotionList = this.#readDataFile("./public/promotions.md");
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
      return this.#createPromotionObj(headers, values);
    });
  }

  #createPromotionObj(headers, values) {
    const obj = {};

    for (let i = 0; i < headers.length; i++) {
      obj[headers[i]] = this.#parseValue(headers[i], values[i]);
    }

    return obj;
  }

  #parseValue(header, value) {
    if (header === "buy" || header === "get") {
      return Number(value);
    }

    return value;
  }

  #isWithinDateRange(startDate, endDate) {
    const today = DateTimes.now();
    const start = new Date(startDate);
    const end = new Date(endDate);

    return start <= today && today <= end;
  }

  get validPromotions() {
    return this.#promotionList.filter((promotion) =>
      this.#isWithinDateRange(promotion.start_date, promotion.end_date)
    );
  }

  get invalidPromotions() {
    return this.#promotionList.filter(
      (promotion) =>
        !this.#isWithinDateRange(promotion.start_date, promotion.end_date)
    );
  }
}

export default PromotionModel;
