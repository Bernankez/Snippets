export function ListNode(this: LIST_NODE, val: number) {
  this.val = val;
  this.next = null;
}

type LIST_NODE = {
  val: any;
  next: LIST_NODE | null;
};

export function isLoop(node: LIST_NODE) {
  const nodeSet = new Set();
  nodeSet.add(node);

  let loop = false;
  let curNode = node;
  while (curNode.next) {
    curNode = curNode.next;
    if (!nodeSet.has(curNode)) {
      nodeSet.add(curNode);
    } else {
      loop = true;
      break;
    }
  }
  return loop;
}
