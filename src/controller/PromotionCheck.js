import Input from "../view/Input.js";
import { SHOPPING_ERROR_MESSAGES } from "../constants/Constants.js";
import Output from "../view/Output.js";

class PromotionCheck {
  #latestStock;
  #productToPurchase;
  #validPromotionList;

  constructor(latestStockModel, promotionInstance, productToPurchase) {
    this.#latestStock = latestStockModel.latestStock;
    this.#validPromotionList = promotionInstance.validPromotions;
    this.#productToPurchase = productToPurchase;
  }

  // 프로모션 기간이 끝난다면
  // 콜라 1,000원 10개
  // 콜라 1,000원 10개
  // 처럼 있기에 filter로 처리해줘야 함
  findProductFromStock(productName) {
    return this.#latestStock.filter((stock) => {
      return stock.name === productName;
    });
  }

  // promotion 재고는 단 하나뿐이므로 find로 처리 가능
  getPromotionStock(productFromStock) {
    return productFromStock.find((stock) => {
      return stock.promotion !== null && stock.quantity !== 0;
    });
  }

  // 프로모션 재고에 대해서 최대 몇개까지 혜택을 받을 수 있는지
  // 2+1 상품에 대해서 프로모션 재고가 2개 있으면 혜택 적용 가능한 개수는 0.
  // 2+1 상품에 대해서 프로모션 재고가 11개 있으면 혜택 적용 가능한 개수는 9.
  getNumberOfBenefits(promotionStock, buy, get) {
    return promotionStock.quantity - (promotionStock.quantity % (buy + get));
  }

  // 프로모션 타입에 따른 [buy, get] 반환
  checkPromotionType(promotionName) {
    const validPromotion = this.#validPromotionList.find((promotion) => {
      return promotion.name === promotionName;
    });
    return [validPromotion.buy, validPromotion.get];
  }

  async confirmPurchaseWithoutBenefit(productName, quantity, numberOfBenefits) {
    while (true) {
      const purchaseOpinion = await Input.getForPurchaseWithoutBenefit(
        productName,
        quantity,
        numberOfBenefits
      );
      try {
        this.#validatePurchaseOpinion(purchaseOpinion);
        return purchaseOpinion;
      } catch (error) {
        Output.printErrorMsg(error.message);
      }
    }
  }

  async confirmAdditionalPurchaseWithBenefits(productName, buy, get, quantity) {
    while (true) {
      const purchaseOpinion = await Input.getForAdditionalPurchase(
        productName,
        buy,
        get,
        quantity
      );
      try {
        this.#validatePurchaseOpinion(purchaseOpinion);
        return purchaseOpinion;
      } catch (error) {
        Output.printErrorMsg(error.message);
      }
    }
  }

  #validatePurchaseOpinion(purchaseOpinion) {
    if (purchaseOpinion !== "Y" && purchaseOpinion !== "N") {
      throw new Error(SHOPPING_ERROR_MESSAGES.UNEXPECTED_ERROR);
    }
  }

  async confirmPurchase() {
    // 확정 구매 목록
    // [ 상품명, 가격, 총수량, 증정 개수, 프로모션 적용 안된 개수 ] 로 이루어짐
    const confirmedProducts = [];

    for (const product of this.#productToPurchase) {
      const [productName, quantity] = product;
      const productFromStock = this.findProductFromStock(productName);
      const price = productFromStock[0].price;

      const promotionStock = this.getPromotionStock(productFromStock);
      if (!promotionStock) {
        confirmedProducts.push([productName, price, quantity, 0, quantity]);
      } else {
        const [buy, get] = this.checkPromotionType(promotionStock.promotion);

        // 프로모션 진행중인 상품에 대해서 몇개까지 혜택 받을 수 있는지
        // 2+1 상품에 대해서 재고가 10개 있으면 9개까지만 혜택 받을 수 있음
        const numberOfBenefits = this.getNumberOfBenefits(
          promotionStock,
          buy,
          get
        );

        // 혜택적용 개수보다 더 많이 담아서 일부는 프로모션 혜택 미적용을 알림
        if (numberOfBenefits < quantity) {
          const answer = await this.confirmPurchaseWithoutBenefit(
            productName,
            quantity,
            numberOfBenefits
          );
          // 그래도 산다면
          if (answer === "Y") {
            if (!numberOfBenefits) {
              // 프로모션으로 혜택을 하나도 못받는다.
              confirmedProducts.push([
                productName,
                price,
                quantity,
                0,
                quantity,
              ]);
            } else {
              // 혜택을 최대로 받을 수 있는 만큼만 받고 일부는 정가로 산다
              confirmedProducts.push([
                productName,
                price,
                quantity,
                (numberOfBenefits / (buy + get)) * get,
                quantity - numberOfBenefits,
              ]);
            }
          } else {
            if (!numberOfBenefits) {
              confirmedProducts.push([productName, 0, 0, 0, 0]);
            } else {
              // 혜택을 최대로 받을 수 있는 만큼만 산다
              confirmedProducts.push([
                productName,
                price,
                numberOfBenefits,
                numberOfBenefits / (buy + get),
                0,
              ]);
            }
          }
        } else {
          // promotion 적용 가능한 최소 개수를 가져왔는지
          // EX. 2+1 상품 8개 가져올 때 ( O )
          // EX. 3+2 상품 7개 가져올 때 ( X )
          if (buy <= quantity % (buy + get)) {
            const answer = await this.confirmAdditionalPurchaseWithBenefits(
              productName,
              buy,
              get,
              quantity
            );
            if (answer === "Y") {
              // 구매하려는 수량 전부 프로모션 혜택을 받는다
              confirmedProducts.push([
                productName,
                price,
                quantity + buy + get - (quantity % (buy + get)),
                ((quantity + buy + get - (quantity % (buy + get))) /
                  (buy + get)) *
                  get,
                0,
              ]);
            } else {
              if (quantity < buy + get) {
                // 프로모션을 아예 못받고 전부 정가결제
                confirmedProducts.push([
                  productName,
                  price,
                  quantity,
                  0,
                  quantity,
                ]);
              } else {
                // 일부만 혜택을 받고 일부는 정가 결제
                confirmedProducts.push([
                  productName,
                  price,
                  quantity,
                  Math.floor(quantity / (buy + get)) * get,
                  quantity - Math.floor(quantity / (buy + get)) * (buy + get),
                ]);
              }
            }
          } else {
            if (quantity % (buy + get) === 0) {
              // 입력한 수량 전부 혜택 받는다
              confirmedProducts.push([
                productName,
                price,
                quantity,
                (quantity / (buy + get)) * get,
                0,
              ]);
            } else {
              // 일부만 혜택 받거나 아예 안받는다
              // EX. 2+1 상품에 대해, 4개만 가져오면 일부만 받고
              // EX. 2+1 상품에 대해, 1개만 가져오면 아예 못받는다
              confirmedProducts.push([
                productName,
                price,
                quantity,
                Math.floor(quantity / (buy + get)) * get,
                quantity - Math.floor(quantity / (buy + get)) * (buy + get),
              ]);
            }
          }
        }
      }
    }
    return confirmedProducts;
  }
}

export default PromotionCheck;
