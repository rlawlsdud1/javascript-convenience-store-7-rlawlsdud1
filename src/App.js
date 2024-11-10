import ProductSelection from "./controller/ProductSelection.js";
import PromotionCheck from "./controller/PromotionCheck.js";
import ShoppingCart from "./controller/ShoppingCart.js";
import StockUpdater from "./controller/StockUpdater.js";
import LatestStockModel from "./model/LatestStockModel.js";
import PromotionModel from "./model/PromotionModel.js";
import Input from "./view/Input.js";

class App {
  async run() {
    const latestStockModelInstance = new LatestStockModel();
    const promotionInstance = new PromotionModel();

    let continueProcess = true;

    while (continueProcess) {
      const selectedProduct = new ProductSelection(latestStockModelInstance);
      selectedProduct.showLatestStock();
      const productToPurchase =
        await selectedProduct.getValidProductToPurchase();
      // 여기까지 오면 적어도 유효한 물건과 수량은 존재함

      // 여기서부터 프로모션 적용 여부를 묻는다.
      // 생성자함수의 인자로 (최신재고, 프로모션 현황, 구매하려는 물건) 을 넘긴다.
      const checkedPromotion = new PromotionCheck(
        latestStockModelInstance,
        promotionInstance,
        productToPurchase
      );

      // 프로모션까지 적용된 상품 목록
      const confirmedProduct = await checkedPromotion.confirmPurchase();
      // confirmedProduct는 상품별로 [ 상품명, 가격, 총수량, 증정 개수, 프로모션 적용 안된 개수 ] 로 이루어짐
      // 예를들어 2+1 중인 콜라에 대해서 4개를 산다고 하면
      // ['콜라', 1000, 4, 1, 1] 이다.
      // 프로모션 적용 안된애들만 멤버십 혜택을 받을 수 있다.
      const shoppingCart = new ShoppingCart(confirmedProduct);
      await shoppingCart.getTotalProductToPurchase();

      const updatedStock = new StockUpdater(
        latestStockModelInstance,
        confirmedProduct
      );
      updatedStock.updateStock();

      // model의 데이터가 변경되고 다시 while문이 돌기 시작하면
      // selectedProduct 는 바뀐 모델을 참조
      continueProcess = await Input.askForAdditionalPurchase();
    }
  }
}

export default App;
