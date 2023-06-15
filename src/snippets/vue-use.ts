const installedPlugin = new Set();

export function initVueUse(Vue) {
  Vue.use = function<T extends Function | { install: Function }>(...params: [T, ...any]) {
    const [plugin, args] = params;
    if (installedPlugin.has(plugin)) {
      return this;
    }
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
