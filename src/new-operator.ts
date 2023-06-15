export function New(fn: any, ...args) {
  // 创建空对象
  const newObj = {};
  // 空对象原型指向构造函数原型
  // @ts-expect-error __proto__ is not in type Object
  newObj.__proto__ = fn.prototype;
  // 指定构造函数this
  const rtn = fn.apply(newObj, args);
  // 返回结果或新对象
  return rtn || newObj;
}

export function People(this: { name: string; sex: string }, name: string) {
  this.name = name;
  this.sex = "male";
}
