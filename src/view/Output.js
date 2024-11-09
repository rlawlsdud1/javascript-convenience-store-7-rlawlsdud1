import { Console } from "@woowacourse/mission-utils";
import { SHOPPING_MESSAGES } from "../constants/Constants.js";

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
}

export default Output;
