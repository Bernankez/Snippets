import { describe } from "vitest";
import { QuickSort } from "./quick-sort";

describe("Quick Sort", () => {
  it("sort by asc", () => {
    expect(QuickSort([5, 1, 9, 6, 4, 8, 3, 5, 7])).toEqual([1, 3, 4, 5, 5, 6, 7, 8, 9]);
  });

  it("sort", () => {
    expect(QuickSort([5, 1, 9, 6, 4, 8, 3, 5, 7])).toMatchInlineSnapshot(`
      [
        1,
        3,
        4,
        5,
        5,
        6,
        7,
        8,
        9,
      ]
    `);
  });

  it("sort", () => {
    expect(QuickSort([5, 1, 5, 6, 4, 3])).toMatchInlineSnapshot(`
      [
        1,
        3,
        4,
        5,
        5,
        6,
      ]
    `);
  });

  it("sort", () => {
    expect(QuickSort([8, 9])).toMatchInlineSnapshot(`
      [
        8,
        9,
      ]
    `);
  });

  it("sort", () => {
    expect(QuickSort([5, 6, 4, 5])).toMatchInlineSnapshot(`
      [
        4,
        5,
        5,
        6,
      ]
    `);
  });

  it("sort", () => {
    expect(QuickSort([6, 8, 9, 7, 9])).toMatchInlineSnapshot(`
      [
        6,
        7,
        8,
        9,
        9,
      ]
    `);
  });

  it("sort", () => {
    expect(QuickSort([1, 2, 3, 9, 5, 4, 6, 8, 7, 9, 5, 4])).toMatchInlineSnapshot(`
      [
        1,
        2,
        3,
        4,
        4,
        5,
        5,
        6,
        7,
        8,
        9,
        9,
      ]
    `);
  });
});
