import { Canceler } from "../mock-axios-types";

export default class CancelToken {
  public static source() {
    let cancel: Canceler;
    const token = new CancelToken((c) => (cancel = c));

    return {
      cancel,
      token,
    };
  }

  constructor(executor: (cancel: Canceler) => void) {
    executor(function cancel(message) {
      return;
    });
  }

  public throwIfRequested() {
    return;
  }
}
