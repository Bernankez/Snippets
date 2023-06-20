import { describe, it } from "vitest";
import { BinarySearch } from "./binary-search";

describe("binary-search", () => {
  it("testing boundary", () => {
    const binarySearch = new BinarySearch([1, 2, 3, 4, 5]);
    expect(binarySearch.search(5)).toBe(4);
  });

  it("testing boundary", () => {
    const binarySearch = new BinarySearch([1, 2, 3, 4, 5]);
    expect(binarySearch.search(1)).toBe(0);
  });

  it("testing odd", () => {
    const binarySearch = new BinarySearch([1, 2, 3, 4, 5]);
    expect(binarySearch.search(3)).toBe(2);
  });

  it("testing even", () => {
    const binarySearch = new BinarySearch([1, 2, 3, 4]);
    expect(binarySearch.search(2)).toBe(1);
  });
});
