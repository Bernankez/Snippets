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
      const length = endIndex - startIndex + 1;
      if (length >= 2) {
        const halfIndex = Math.floor(length / 2) - 1;
        const firstIndex = this._search(startIndex, startIndex + halfIndex + 1);
        if (isDefined(firstIndex)) {
          return firstIndex;
        }
        const secondIndex = this._search(startIndex + halfIndex + 1, endIndex + 1);
        if (isDefined(secondIndex)) {
          return secondIndex;
        }
        return undefined;
      } else if (length === 1 && this.elements[startIndex] === this.n) {
        return startIndex;
      }
    }
    return undefined;
  }
}
