import { Component1 } from "./component1";
import { Component2 } from "./component2";

export function EventBusComponent() {
  return <div class="flex flex-col flex-gap-3">
    <div class="b-1 b-dark-100 b-solid p-3">
      <div class="font-bold">Component1</div>
      <Component1 />
    </div>
    <div class="b-1 b-dark-100 b-solid p-3">
      <div class="font-bold">Component2</div>
      <Component2 />
    </div>
  </div>;
}
