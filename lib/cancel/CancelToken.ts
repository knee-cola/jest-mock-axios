import { Cancel } from "./Cancel";

type Canceler = (message?: string) => void;

export default class CancelToken {
  public static source() {
    let cancel: Canceler;
    const token = new CancelToken((c) => (cancel = c));

    return {
      cancel,
      token,
    };
  }

  public promise: Promise<Cancel>;

  constructor(executor: (cancel: Canceler) => void) {
    executor(function cancel(message) {
      return;
    });
  }

  public throwIfRequested() {
    return;
  }
}
