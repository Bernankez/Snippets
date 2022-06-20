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
    return new PromiseLike((resolve, reject) => {
      let result;
      const callback = () => {
        // 当then执行时promise未被决议
        // TODO 当then执行时promise已被决议
        if (this._state === PromiseState.FULFILLED && onFulfilled) {
          result = onFulfilled.call(null, this._result);
        } else if (this._state === PromiseState.REJECTED) {
          result = onRejected.call(null, this._result);
        }
        if (result && typeof result.then === "function") {
          // 执行结果如果仍是thenable的，则向下传递resolve,reject，新一轮微任务中执行
          result.then(resolve, reject);
        } else {
          // 返回fulfilled的result
          resolve(result);
        }
      };

      this._callback.push(callback);
    });
  }
}

let adapter = {
  deferred() {
    return {
      promise: new PromiseLike((resolve, reject) => {}),
      resolve(value) {
        return new PromiseLike((resolve, reject) => {
          resolve(value);
        });
      },
      reject(reason) {
        return new PromiseLike((resolve, reject) => {
          reject(reason);
        });
      },
    };
  },
};
module.exports = adapter;

// const a = new PromiseLike((resolve, reject) => {
//   console.log("111");
//   resolve(1);
//   console.log("222");
// }).then(res => {
//   console.log(res);
// });

// const b = new PromiseLike((resolve, reject) => {
//   resolve(1);
//   console.log("b");
// });

// const c = b.then(res => {
//   console.log("c");
//   console.log(res);
//   // return res + 1;
//   return new PromiseLike((resolve, reject) => resolve(1));
// });
// // const d = b.then(res => {
// //   console.log("d");
// // });
// const e = c.then(res => {
//   console.log(res);
// });
