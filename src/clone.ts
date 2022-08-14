export function clone(origin: any) {
  if ((typeof origin !== "object" && typeof origin !== "function") || origin === null) {
    return origin;
  }
  let anyObj: any = {};
  if (Array.isArray(origin)) {
    anyObj = [];
    origin.forEach(item => {
      anyObj.push(clone(item));
    });
  } else if (typeof origin === "function") {
    anyObj = new Function("return" + origin.toString())();
  } else if (origin instanceof Set) {
    anyObj = new Set();
    origin.forEach(val => {
      anyObj.add(clone(val));
    });
  }
  Reflect.ownKeys(origin).forEach(key => {
    if (anyObj.hasOwnProperty(key)) {
      return;
    } else if (origin[key] === origin) {
      anyObj[key] = anyObj;
    } else {
      anyObj[key] = clone(origin[key]);
    }
  });
  return anyObj;
}
