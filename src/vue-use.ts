const installedPlugin = new Set();

export function initVueUse(Vue) {
  Vue.use = function <T extends Function | { install: Function }>(plugin: T) {
    if (installedPlugin.has(plugin)) {
      return this;
    }
    const args = sliceArguments(arguments, 1);
    if (typeof plugin === "function") {
      plugin.call(null, this, ...args);
    } else if (typeof plugin.install === "function") {
      plugin.install.call(plugin, this, ...args);
    }

    installedPlugin.add(plugin);

    return this;
  };
}

function sliceArguments(args: IArguments, start: number) {
  const length = args.length;
  const list: any = [];
  for (let i = start; i < length; i++) {
    list.push(args[i]);
  }
  return list;
}