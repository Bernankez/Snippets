export class BinaryHeap {
  private heap: number[];

  constructor(compare: (a: number, b: number) => boolean, array?: number[]) {
    this.heap = array = array || [];
  }

  parentIndex(i: number) {
    return Math.floor(i / 2);
  }

  parent(i: number) {
    return this.heap[this.parentIndex(i)];
  }

  leftIndex(i: number) {
    return 2 * i;
  }

  left(i: number) {
    return this.heap[this.leftIndex(i)];
  }

  rightIndex(i: number) {
    return 2 * i + 1;
  }

  right(i: number) {
    return this.heap[this.rightIndex(i)];
  }


  swap(i1:number,i2:number){
  }

  heapify() {

  }

  push() {}

  pop() {}
}
