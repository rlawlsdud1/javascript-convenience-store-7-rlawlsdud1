import { Console } from "@woowacourse/mission-utils";
import {
  SHOPPING_ERROR_MESSAGES,
  SHOPPING_MESSAGES,
} from "../constants/Constants.js";

class Input {
  static async requestProductAndQuantity() {
    return await Console.readLineAsync(
      SHOPPING_MESSAGES.REQUEST_PRODUCT_AND_QUANTITY_MESSAGE
    );
  }
}

export default Input;
