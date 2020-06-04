import { Cancel } from "./Cancel";

type Canceler = (message?: string) => void;

/**
 * Based of https://github.com/axios/axios
 * Copyright (c) 2014-present Matt Zabriskie (MIT License)
 */
export default class CancelToken {
  public static source() {
    let cancel: Canceler;
    const token = new CancelToken((c) => (cancel = c));

    return {
      cancel,
      token,
    };
  }

  private resolvePromise: (string) => void;

  public reason: Cancel;

  public promise: Promise<Cancel>;

  constructor(executor: (cancel: Canceler) => void) {
    const token = this;

    this.promise = new Promise((resolve) => {
        token.resolvePromise = resolve;
    });

    executor(function cancel(message) {
        if(token.reason || !token.resolvePromise) {
            return;
        }

        token.reason = new Cancel(message)
        token.resolvePromise(token.reason)
    });
  }

  public throwIfRequested() {
      if(this.reason) {
          throw this.reason;
      }
  }
}
