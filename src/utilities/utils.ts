import type { CartItemProps } from "~/types";

export const objectsEqual = (o1: CartItemProps, o2: CartItemProps) =>
	Object.keys(o1).length === Object.keys(o2).length &&
	Object.keys(o1).every((p) => o1[p] === o2[p]);

export const arraysEqual = (a1: CartItemProps[], a2: CartItemProps[]) =>
	a1.length === a2.length && a1.every((o: CartItemProps, idx: number) => objectsEqual(o, a2[idx]));
