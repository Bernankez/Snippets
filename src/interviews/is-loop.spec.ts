import { describe, it, expect } from "vitest";
import { isLoop, ListNode } from "./is-loop";

const a = new ListNode(1);
const b = (a.next = new ListNode(2));
const c = (b.next = new ListNode(4));
const d = (c.next = new ListNode(2));
d.next = a;
describe("is-loop", () => {
  it("a", () => {
    expect(a.next).toBe(b);
  });

  it("isLoop-a", () => {
    expect(isLoop(a)).toBe(true);
  });

  it("isLoop-d", () => {
    expect(isLoop(d)).toBe(true);
  });
});
