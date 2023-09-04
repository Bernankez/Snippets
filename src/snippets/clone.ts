export function clone(origin: any) {
  if ((typeof origin !== "object" && typeof origin !== "function") || origin === null) {
    // 基本类型直接返回
    return origin;
  }
  let anyObj: any = {};
  if (Array.isArray(origin)) {
    // 数组（特殊对象）clone
    anyObj = [];
    origin.forEach((item) => {
      anyObj.push(clone(item));
    });
  } else if (typeof origin === "function") {
    // 函数clone
    anyObj = new Function(`return${origin.toString()}`)();
  } else if (origin instanceof Set) {
    // 特殊对象clone
    anyObj = new Set();
    origin.forEach((val) => {
      anyObj.add(clone(val));
    });
  }
  // 环形指向
  Reflect.ownKeys(origin).forEach((key) => {
    if (anyObj.hasOwnProperty(key)) {

    } else if (origin[key] === origin) {
      anyObj[key] = anyObj;
    } else {
      anyObj[key] = clone(origin[key]);
    }
  });
  return anyObj;
}
