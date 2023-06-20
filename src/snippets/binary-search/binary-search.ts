import { isDefined } from "@/utils";

export class BinarySearch {
  public n: number | undefined = undefined;

  constructor(public elements: number[]) {}

  search(n: number) {
    this.n = n;
    return this._search(0, this.elements.length - 1);
  }

  private _search(startIndex: number, endIndex: number): number {
    if (isDefined(this.n)) {
      if (startIndex === endIndex) {
        return this.elements[startIndex] === this.n ? startIndex : -1;
      }
      const halfIndex = Math.floor((endIndex - startIndex) / 2) + startIndex;
      if (this.elements[halfIndex] === this.n) {
        return halfIndex;
      } else if (this.elements[halfIndex] < this.n) {
        return this._search(halfIndex + 1 > endIndex ? endIndex : halfIndex + 1, endIndex);
      } else {
        return this._search(startIndex, halfIndex - 1 < startIndex ? startIndex : halfIndex - 1);
      }
    }
    return -1;
  }
}
