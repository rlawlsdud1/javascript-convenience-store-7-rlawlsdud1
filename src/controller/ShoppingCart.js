import { Console } from "@woowacourse/mission-utils";
import Input from "../view/Input.js";
import { SHOPPING_ERROR_MESSAGES } from "../constants/Constants.js";
import Output from "../view/Output.js";

class ShoppingCart {
  #confirmedProduct;

  constructor(confirmedProduct) {
    this.#confirmedProduct = confirmedProduct;
  }

  async askForMembershipDiscount() {
    while (true) {
      const membershipDiscountChoice = await Input.askForMembershipDiscount();
      try {
        this.#validatePurchaseOpinion(membershipDiscountChoice);
        return membershipDiscountChoice;
      } catch (error) {
        Console.print(error.message);
      }
    }
  }

  #validatePurchaseOpinion(purchaseOpinion) {
    if (purchaseOpinion !== "Y" && purchaseOpinion !== "N") {
      throw new Error(SHOPPING_ERROR_MESSAGES.INVALID_FORMAT);
    }
  }

  async getTotalProductToPurchase() {
    const {
      purchasedItems,
      giftedItems,
      totalQuantityOfProducts,
      totalPriceOfProducts,
      promotionalPrice,
      nonBenefitTotalPrice,
    } = this.calculateProductTotals();

    const membershipDiscountPrice = await this.calculateMembershipDiscount(
      nonBenefitTotalPrice
    );
    const finalAmountDue =
      totalPriceOfProducts - promotionalPrice - membershipDiscountPrice;

    Output.printReceiptHeader();
    Output.printPurchasedItems(purchasedItems);
    Output.printGiftedItems(giftedItems);
    Output.printReceiptFooter(
      totalQuantityOfProducts,
      totalPriceOfProducts,
      promotionalPrice,
      membershipDiscountPrice,
      finalAmountDue
    );
  }

  calculateProductTotals() {
    let totalQuantityOfProducts = 0,
      totalPriceOfProducts = 0,
      promotionalPrice = 0,
      nonBenefitTotalPrice = 0;
    const purchasedItems = [];
    const giftedItems = [];

    for (const product of this.#confirmedProduct) {
      const [
        productName,
        price,
        totalQuantity,
        bonusQuantity,
        nonBenefitQuantity,
      ] = product;

      if (bonusQuantity) {
        giftedItems.push([productName, bonusQuantity, price * bonusQuantity]);
      }
      purchasedItems.push([productName, totalQuantity, price * totalQuantity]);
      totalQuantityOfProducts += totalQuantity;
      totalPriceOfProducts += price * totalQuantity;
      promotionalPrice += price * bonusQuantity;
      nonBenefitTotalPrice += price * nonBenefitQuantity;
    }

    return {
      purchasedItems,
      giftedItems,
      totalQuantityOfProducts,
      totalPriceOfProducts,
      promotionalPrice,
      nonBenefitTotalPrice,
    };
  }

  async calculateMembershipDiscount(nonBenefitTotalPrice) {
    const membershipDiscountChoice = await this.askForMembershipDiscount();
    if (membershipDiscountChoice === "Y") {
      return Math.min(nonBenefitTotalPrice * 0.3, 8000);
    }
    return 0;
  }
}

export default ShoppingCart;
