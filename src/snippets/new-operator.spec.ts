import { describe, expect, it } from "vitest";
import { New, People } from "./new-operator";

const p = New(People, "some");
const p1 = new People("some");

describe("simulate new", () => {
  it("equal", () => {
    expect(p).toStrictEqual(p1);
  });

  it("instanceof", () => {
    expect(p instanceof People).toBe(true);
  });

  it("prototype", () => {
    expect(p1.__proto__).toBe(People.prototype);
    expect(p.__proto__).toBe(People.prototype);
  });
});
