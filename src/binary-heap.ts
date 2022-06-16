export class BinaryHeap<T> {
  private _heap: T[];

  constructor(private compare: (a: T, b: T) => boolean, array?: T[]) {
    this._heap = array = array || [];
    this.build();
  }

  get heap() {
    return [...this._heap];
  }

  get size() {
    return this._heap.length;
  }

  self(i: number) {
    return this._heap[i];
  }

  parentIndex(i: number) {
    return Math.floor((i - 1) / 2);
  }

  parent(i: number) {
    return this._heap[this.parentIndex(i)];
  }

  leftIndex(i: number) {
    return 2 * i + 1;
  }

  left(i: number) {
    return this._heap[this.leftIndex(i)];
  }

  rightIndex(i: number) {
    return 2 * i + 2;
  }

  right(i: number) {
    return this._heap[this.rightIndex(i)];
  }

  swap(i: number, j: number) {
    const temp = this._heap[j];
    this._heap[j] = this._heap[i];
    this._heap[i] = temp;
  }

  heapify(i: number) {
    const s = this.self(i);
    const l = this.left(i);
    const r = this.right(i);
    const li = this.leftIndex(i);
    const ri = this.rightIndex(i);
    // let small equals self index
    let small = i;
    if (li < this.size && this.compare(s, l)) {
      // if has left child and left child smaller than self
      small = li;
    }
    if (ri < this.size && this.compare(this._heap[small], r)) {
      // if has right child and right child smaller than smallest
      small = ri;
    }
    if (small !== i) {
      // if self is not the smallest
      this.swap(i, small);
      // small has been changed, so need to heapify
      this.heapify(small);
    }
  }

  pop() {
    const rtn = this._heap.shift();
    const last = this._heap.pop();
    last !== null && last !== undefined && this._heap.unshift(last);
    this.heapify(0);
    return rtn;
  }

  push(x: T) {
    this._heap.push(x);
    let i = this.size - 1;
    while (i !== 0 && this.compare(this.parent(i), this._heap[i])) {
      this.swap(i, this.parentIndex(i));
      i = this.parentIndex(i);
    }
    return this;
  }

  private build() {
    // 从最后一个非叶子子节点开始向上构建
    for (let i = this.parentIndex(this.size - 1); i >= 0; i--) {
      this.heapify(i);
    }
  }
}

const bh = new BinaryHeap((a, b) => a < b, [0, 5, 10, 1, 9, 6]);
console.log(bh.heap);
