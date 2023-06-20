import { isDefined } from "@/utils";

export class BinarySearch {
  public n: number | undefined = undefined;

  constructor(public elements: number[]) {}

  search(n: number) {
    this.n = n;
    return this._search(0, this.elements.length);
  }

  private _search(startIndex: number, endIndex: number): number | undefined {
    if (isDefined(this.n)) {
      const length = endIndex - startIndex;
      const halfIndex = startIndex + Math.ceil(length / 2);
      if (this.elements[halfIndex] === this.n) {
        return halfIndex;
      } else if (this.elements[halfIndex] < this.n) {
        return this._search(halfIndex, endIndex);
      } else {
        return this._search(startIndex, halfIndex);
      }
    }
    return undefined;
  }
}

const a = new BinarySearch([0, 1, 2, 3, 4]);
console.log(a.search(4));
