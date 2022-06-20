const enum PromiseState {
  PENDING = "pending",
  FULFILLED = "fulfilled",
  REJECTED = "rejected",
}

export class PromiseLike<V, R> {
  private _state: PromiseState;
  private _result: V | R | undefined;
  private _callback: any[];

  constructor(executor: (resolve: (value: V) => any, reject: (reason: R) => any) => any) {
    if (typeof executor !== "function") {
      throw new TypeError(`PromiseLike: executor ${executor} must be Function`);
    }
    this._state = PromiseState.PENDING;
    this._callback = [];

    const resolve = (value: V) => {
      // 一旦promise被决议，状态就不会再改变，且一个then只会被执行一遍
      if (this._state !== PromiseState.PENDING) {
        return;
      }
      this._state = PromiseState.FULFILLED;
      this._result = value;

      // resolve后，在微任务队列中循环执行每一个callback
      // 这里的callback为then中push的callback
      queueMicrotask(() => {
        this._callback.forEach(cb => {
          cb(this._result);
        });
      });
    };
    const reject = (reason: R) => {
      if (this._state !== PromiseState.PENDING) {
        return;
      }
      this._state = PromiseState.REJECTED;
      this._result = reason;

      queueMicrotask(() => {
        this._callback.forEach(cb => {
          cb(this._result);
        });
      });
    };

    executor(resolve, reject);
  }

  then(onfulfilled?, onrejected?) {
    const onFulfilled = typeof onfulfilled === "function" ? onfulfilled : undefined;
    const onRejected = typeof onrejected === "function" ? onrejected : undefined;

    // 对于每个then 返回一个Promise
    const rtn = new PromiseLike((resolve, reject) => {
      let result;
      const callback = () => {
        try {
          // 当then执行时promise未被决议
          if (this._state === PromiseState.FULFILLED) {
            if (onFulfilled) {
              result = onFulfilled.call(undefined, this._result);
            } else {
              resolve(this._result);
            }
          } else if (this._state === PromiseState.REJECTED) {
            if (onRejected) {
              result = onRejected.call(undefined, this._result);
            } else {
              reject(this._result);
            }
          }
        } catch (e) {
          reject(e);
        }
        if ((result && "then" in result) || typeof result === "function") {
          // 执行结果如果仍是thenable的，则向下传递resolve,reject，新一轮微任务中执行
          if (result === rtn) {
            reject(new TypeError("PromiseLike: the value or reason cannot be promise it self."));
          } else if ("then" in result) {
            const _resolve = value => {
              try {
                if (typeof value === "object" && value && "then" in value) {
                  value.then(_resolve, _reject);
                } else {
                  resolve(value);
                }
              } catch (e) {
                reject(e);
              }
            };
            const _reject = reason => {
              reject(reason);
            };
            try {
              result.then(_resolve, _reject);
            } catch (e) {
              reject(e);
            }
          } else {
            result.call(result, this._result, resolve, reject);
          }
        } else {
          // 返回fulfilled的result
          resolve(result);
        }
      };
      if (this._state !== PromiseState.PENDING) {
        // 当promise已经被决议时，进入微任务列表执行
        queueMicrotask(() => {
          callback();
        });
      } else {
        this._callback.push(callback);
      }
    });
    return rtn;
  }
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
