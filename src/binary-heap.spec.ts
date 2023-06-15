import { describe, expect, it } from "vitest";
import { BinaryHeap } from "./binary-heap";

const heap = new BinaryHeap((a, b) => a > b, [0, 10, 5, 6, 8, 40, 1]);

describe("BinaryHeap", () => {
  it("heap is built", () => {
    expect(heap.heap).toStrictEqual([0, 6, 1, 10, 8, 40, 5]);
  });

  it("heap poped", () => {
    heap.pop();
    expect(heap.heap).toStrictEqual([1, 6, 5, 10, 8, 40]);
  });

  it("heap pushed", () => {
    heap.push(1);
    expect(heap.heap).toStrictEqual([1, 6, 1, 10, 8, 40, 5]);
  });
});
