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
    if (typeof exector !== "function") {
      throw new TypeError("PromiseLike: exector must be Function");
    }
    this._state = PromiseState.PENDING;
    this._value = undefined;
    this._callbacks = [];

    const resolve = value => {
      if (this._state !== PromiseState.PENDING) {
        return;
      }
      this._state = PromiseState.FULFILLED;
      this._value = value;

      createMicroTask(() => {
        this._callbacks.forEach(fn => {
          fn(this._state);
        });
      });
    };
    const reject = reason => {
      if (this._state !== PromiseState.PENDING) {
        return;
      }
      this._state = PromiseState.REJECTED;
      this._value = reason;

      createMicroTask(() => {
        this._callbacks.forEach(fn => {
          fn(this._state);
        });
      });
    };

    exector(resolve, reject);
  }

  then(onfulfilled?, onrejected?) {
    const onFulfilled = typeof onfulfilled === "function" ? onfulfilled : undefined;
    const onRejected = typeof onrejected === "function" ? onrejected : undefined;

    const rtn = new PromiseLike((resolve, reject) => {
      const callback = (state: PromiseState) => {
        let result;
        // 根据state 执行onFulfilled或onRejected 如果onFulfilled或onRejected不是函数则被忽略 传递相同终值给下一Promise
        try {
          if (state === PromiseState.PENDING) return;
          else if (state === PromiseState.FULFILLED) {
            if (onFulfilled) {
              result = onFulfilled.call(undefined, this._value);
            } else {
              resolve(this._value);
              return;
            }
          } else if (state === PromiseState.REJECTED) {
            if (onRejected) {
              result = onRejected.call(undefined, this._value);
            } else {
              reject(this._value);
              return;
            }
          }
        } catch (e) {
          reject(e);
          return;
        }
        if (result === rtn) {
          reject(new TypeError("PromiseLike: return value cannot be it self"));
          return;
        }
        if (result instanceof PromiseLike) {
          result.then(resolve, reject);
          return;
        } else if (typeof result === "function" || (result && typeof result === "object")) {
          let _then;
          try {
            _then = result.then;
          } catch (e) {
            reject(e);
            return;
          }
          if (typeof _then === "function") {
            const rtn = _then.call(result, resolve, reject);
            // TODO 2.3.3.3
            return;
          }
        }
        resolve(result);
      };
      if (this._state !== PromiseState.PENDING) {
        createMicroTask(() => {
          callback(this._state);
        });
      } else {
        this._callbacks.push(callback);
      }
    });
    return rtn;
  }
}

function createMicroTask(fn) {
  queueMicrotask(fn);
}

let adapter = {
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
module.exports = adapter;
