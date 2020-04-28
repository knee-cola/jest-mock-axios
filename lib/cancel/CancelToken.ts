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

  public promise: Promise<Cancel>;

  constructor(executor: (cancel: Canceler) => void) {
    this.promise = new Promise((resolve) => {
        this.resolvePromise = resolve;
    });

    executor(function cancel(message) {
        if(this.token.reason || !this.token.resolvePromise) {
            return;
        }

        this.token.reason = new Cancel(message)
        this.token.resolvePromise(this.token.reason)
    });
  }

  public throwIfRequested() {
    return;
  }
}
