import { Console } from "@woowacourse/mission-utils";
import {
  SHOPPING_ERROR_MESSAGES,
  SHOPPING_MESSAGES,
} from "../constants/Constants.js";
import Output from "./Output.js";

class Input {
  static async requestProductAndQuantity() {
    return await Console.readLineAsync(
      SHOPPING_MESSAGES.REQUEST_PRODUCT_AND_QUANTITY_MESSAGE
    );
  }

  static async getForPurchaseWithoutBenefit(
    productName,
    quantity,
    numberOfBenefits
  ) {
    return await Console.readLineAsync(
      `현재 ${productName} ${
        quantity - numberOfBenefits
      }개는 프로모션이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`
    );
  }

  static async getForAdditionalPurchase(productName, buy, get, quantity) {
    return await Console.readLineAsync(
      `현재 ${productName}은(는) ${
        buy + get - (quantity % (buy + get))
      }개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`
    );
  }

  static async askForMembershipDiscount() {
    return await Console.readLineAsync(
      SHOPPING_MESSAGES.REQUEST_MEMBERSHIP_APPLIED
    );
  }

  static async askForAdditionalPurchase() {
    while (true) {
      const answer = await Console.readLineAsync(
        SHOPPING_MESSAGES.ADDITIONAL_PURCHASE
      );
      try {
        if (answer === "Y") {
          return true;
        } else if (answer === "N") {
          return false;
        } else {
          throw new Error();
        }
      } catch (error) {
        Output.printErrorMsg(SHOPPING_ERROR_MESSAGES.INVALID_FORMAT);
      }
    }
  }
}

export default Input;
