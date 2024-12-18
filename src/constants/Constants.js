export const SHOPPING_ERROR_MESSAGES = {
  INVALID_PRODUCT_NAME: "[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.",
  INVALID_FORMAT:
    "[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.",
  QUANTITY_EXCEEDED:
    "[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.",
  UNEXPECTED_ERROR: "[ERROR] 잘못된 입력입니다. 다시 입력해 주세요.",
};

export const SPECIAL_CHARACTER = {
  COMMA: ",",
  LEFT_BRACKET: "[",
  RIGHT_BRACKET: "]",
  DASH: "-",
};

export const SHOPPING_MESSAGES = {
  WELCOME_MESSAGE:
    "\n안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다.\n",
  REQUEST_PRODUCT_AND_QUANTITY_MESSAGE:
    "\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n",
  REQUEST_MEMBERSHIP_APPLIED: "\n멤버십 할인을 받으시겠습니까? (Y/N)\n",
  ADDITIONAL_PURCHASE:
    "\n감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)\n",
};

export const FIELD_LENGTH = {
  productName: 12,
  quantity: 8,
  price: 10,
  total: 16,
  discount: 25,
};

export const PRINT_MESSAGES = {
  STORE_NAME: "==============W 편의점================",
  GIFT_HEADER: "=============증	정===============",
  SEPARATOR: "====================================",
  PRODUCT_HEADER: {
    NAME: "상품명",
    QUANTITY: "수량",
    PRICE: "금액",
  },
  TOTALS: {
    TOTAL_PURCHASE: "총구매액",
    PROMO_DISCOUNT: "행사할인",
    MEMBERSHIP_DISCOUNT: "멤버십할인",
    AMOUNT_DUE: "내실돈",
  },
};
