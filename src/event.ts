const events: Map<string, Set<(...args) => any>> = new Map();

export function $emit(event: string, ...props) {
  const cbList = events.get(event);
  if (cbList) {
    cbList.forEach((cb) => {
      cb(...props);
    });
  }
}

export function $on(event: string, cb: (...args) => any) {
  const cbSet = events.get(event);
  if (cbSet) {
    cbSet.add(cb);
  } else {
    events.set(event, new Set([cb]));
  }
}

export function $off(event: string, cb?: (...args) => any) {
  if (cb) {
    const cbSet = events.get(event);
    cbSet?.delete(cb);
  } else {
    events.delete(event);
  }
}

$on("click", test);
$on("click", (e) => {
  console.log("dd");
});

function test(e) {
  console.log(e);
}

$emit("click", { x: 0, y: 0 }); // {x:0,y:0} dd
$off("click", test);
$emit("click", { x: 0, y: 0 }); // dd
$off("click");
$emit("click", { x: 0, y: 0 }); //
