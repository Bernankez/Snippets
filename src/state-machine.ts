import StateMachine from "javascript-state-machine";

const enum orderState {
  WAIT_PAY = "WAIT_PAY",
  WAIT_RESERVE = "WAIT_RESERVE",
  WAIT_EXAM = "WAIT_EXAM",
  WAIT_REPORT = "WAIT_REPORT",
  REPORTED = "REPORTED",
  EVALUATED = "EVALUATED",
  DONE = "DONE",
  AFTER_SALE = "AFTER_SALE",
}

export const order = new StateMachine({
  init: "WAIT_PAY",
  transitions: [
    { name: "pay", from: orderState.WAIT_PAY, to: orderState.WAIT_EXAM },
    { name: "reserve", from: orderState.WAIT_EXAM, to: orderState.WAIT_RESERVE },
    { name: "cancelReserve", from: orderState.WAIT_RESERVE, to: orderState.WAIT_EXAM },
    { name: "exam", from: orderState.WAIT_EXAM, to: orderState.WAIT_REPORT },
    { name: "report", from: orderState.WAIT_REPORT, to: orderState.REPORTED },
    { name: "evaluate", from: orderState.REPORTED, to: orderState.DONE },
    { name: "afterSale", from: "*", to: orderState.AFTER_SALE },
    {
      name: "goto",
      from: "*",
      to: function (s) {
        return s;
      },
    },
  ],
  methods: {
    onPay() {
      console.log("paied");
    },
    onReserve() {
      console.log("reserved");
    },
    onCancelReserve() {
      console.log("reserve cancel");
    },
  },
});
