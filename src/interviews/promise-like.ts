const enum PromiseState {
  PENDING = "pending",
  FULFILLED = "fulfilled",
  REJECTED = "rejected",
}

export class PromiseLike {
  private _state: PromiseState;
  private _value: any; // 被决议的终值
  private _callbacks: any[]; // then中被注册的回调

  constructor(exector: (resolve, reject) => any) {
    this._state = PromiseState.PENDING;
    this._value = undefined;
    this._callbacks = [];

    const resolve = value => {
      if (this._state !== PromiseState.PENDING) return;
      this._state = PromiseState.FULFILLED;
      this._value = value;

      createMicroTask(() => {
        this._callbacks.forEach(cb => {
          cb();
        });
      });
    };
    const reject = reason => {
      if (this._state !== PromiseState.PENDING) return;
      this._state = PromiseState.REJECTED;
      this._value = reason;

      createMicroTask(() => {
        this._callbacks.forEach(cb => {
          cb();
        });
      });
    };

    exector(resolve, reject);
  }

  then(onfulfilled?, onrejected?) {
    const onFulfilled = typeof onfulfilled === "function" ? onfulfilled : undefined;
    const onRejected = typeof onrejected === "function" ? onrejected : undefined;

    const returnValue = new PromiseLike((resolve, reject) => {
      const callback = () => {
        if (this._state === PromiseState.PENDING) {
          return;
        } else {
          let fn;
          if (this._state === PromiseState.FULFILLED) {
            if (onFulfilled) {
              fn = onFulfilled;
            } else {
              resolve(this._value);
              return;
            }
          } else if (this._state === PromiseState.REJECTED) {
            if (onRejected) {
              fn = onRejected;
            } else {
              reject(this._value);
              return;
            }
          }
          let result;
          try {
            result = fn.call(undefined, this._value);
          } catch (e) {
            reject(e);
            return;
          }
          resolution(returnValue, result, resolve, reject);
        }
      };

      if (this._state !== PromiseState.PENDING) {
        createMicroTask(callback);
      } else {
        this._callbacks.push(callback);
      }
    });

    return returnValue;
  }
}

function resolution(promise, value, resolve, reject) {
  if (promise === value) {
    reject(new TypeError("PromiseLike: promise cannot have the same reference with value"));
    return;
  } else if (typeof value === "function" || (value && typeof value === "object")) {
    let then;
    try {
      then = value.then;
    } catch (e) {
      reject(e);
      return;
    }
    if (typeof then === "function") {
      let called = false;
      const resolvePromise = val => {
        if (called) return;
        called = true;
        resolution(promise, val, resolve, reject);
      };
      const rejectPromise = res => {
        if (called) return;
        called = true;
        reject(res);
      };
      try {
        then.call(value, resolvePromise, rejectPromise);
      } catch (e) {
        rejectPromise(e);
      }
    } else {
      resolve(value);
    }
  } else {
    resolve(value);
  }
}

function createMicroTask(fn) {
  queueMicrotask(fn);
}

export const adapter = {
  deferred() {
    let res, rej;
    const promise = new PromiseLike((resolve, reject) => {
      res = resolve;
      rej = reject;
    });
    return {
      promise,
      resolve: res,
      reject: rej,
    };
  },
};
// module.exports = adapter;
