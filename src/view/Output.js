import { Console } from "@woowacourse/mission-utils";
import {
  FIELD_LENGTH,
  PRINT_MESSAGES,
  SHOPPING_MESSAGES,
} from "../constants/Constants.js";

class Output {
  static printWelcomeMsg() {
    Console.print(SHOPPING_MESSAGES.WELCOME_MESSAGE);
  }

  static printStocks(stocks) {
    stocks.forEach((stock) => {
      Console.print(stock);
    });
  }

  static printErrorMsg(message) {
    Console.print(message);
  }

  static printReceiptHeader() {
    Console.print(PRINT_MESSAGES.STORE_NAME);
    Console.print(
      PRINT_MESSAGES.PRODUCT_HEADER.NAME.padEnd(FIELD_LENGTH.productName) +
        PRINT_MESSAGES.PRODUCT_HEADER.QUANTITY.padEnd(FIELD_LENGTH.quantity) +
        PRINT_MESSAGES.PRODUCT_HEADER.PRICE
    );
  }

  static printPurchasedItems(purchasedItems) {
    purchasedItems.forEach(([productName, quantity, price]) => {
      Console.print(
        productName.padEnd(FIELD_LENGTH.productName) +
          String(quantity).padEnd(FIELD_LENGTH.quantity) +
          price.toLocaleString().padStart(FIELD_LENGTH.price)
      );
    });
  }

  static printGiftedItems(giftedItems) {
    Console.print(PRINT_MESSAGES.GIFT_HEADER);
    giftedItems.forEach(([productName, quantity, price]) => {
      Console.print(
        productName.padEnd(FIELD_LENGTH.productName) +
          String(quantity).padEnd(FIELD_LENGTH.quantity)
      );
    });
  }

  static printReceiptFooter(
    totalQuantityOfProducts,
    totalPriceOfProducts,
    promotionalPrice,
    membershipDiscountPrice,
    finalAmountDue
  ) {
    Console.print(PRINT_MESSAGES.SEPARATOR);
    Console.print(
      PRINT_MESSAGES.TOTALS.TOTAL_PURCHASE.padEnd(FIELD_LENGTH.total) +
        String(totalQuantityOfProducts).padEnd(FIELD_LENGTH.quantity) +
        totalPriceOfProducts.toLocaleString().padStart(FIELD_LENGTH.price)
    );
    Console.print(
      PRINT_MESSAGES.TOTALS.PROMO_DISCOUNT.padEnd(FIELD_LENGTH.discount) +
        `-${promotionalPrice.toLocaleString()}`
    );
    Console.print(
      PRINT_MESSAGES.TOTALS.MEMBERSHIP_DISCOUNT.padEnd(FIELD_LENGTH.discount) +
        `-${membershipDiscountPrice.toLocaleString()}`
    );
    Console.print(
      PRINT_MESSAGES.TOTALS.AMOUNT_DUE.padEnd(FIELD_LENGTH.discount) +
        finalAmountDue.toLocaleString()
    );
  }
}

export default Output;
