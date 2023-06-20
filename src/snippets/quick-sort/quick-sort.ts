export function QuickSort(elements: number[]): number[] {
  if (elements.length > 2) {
    const pivot = elements[elements.length - 1]!;
    let left = 0;
    let right = elements.length - 2;
    let flag = elements.length - 1;
    while (left < right) {
      left = find(elements, left, right, pivot, "next");
      if (left > -1 && left < flag) {
        elements[flag] = elements[left];
        flag = left;
      }
      left++;
      right = find(elements, left, right, pivot, "last");
      if (right > -1 && right > flag) {
        elements[flag] = elements[right];
        flag = right;
      }
      right--;
    }
    elements[flag] = pivot;
    return QuickSort(elements.slice(0, flag)).concat(pivot).concat(QuickSort(elements.slice(flag + 1, elements.length)));
  } else if (elements.length === 2) {
    const [a, b] = elements;
    if (a > b) {
      return [b, a];
    }
  }
  return elements;
}

function find(elements: number[], start: number, end: number, p: number, type: "next" | "last") {
  if (type === "next") {
    for (let i = start; i <= end; i++) {
      if (elements[i] > p) {
        return i;
      }
    }
  } else if (type === "last") {
    for (let i = end; i >= start; i--) {
      if (elements[i] < p) {
        return i;
      }
    }
  }
  return -1;
}
