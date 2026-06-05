// resolve "order" to a safe, 0+ integer, otherwise return undefined
// Note: Any changes to this function should also be made to "resolveStart"
// in packages/editor/adf-schema/src/schema/nodes/ordered-list.ts
export const resolveOrder = (order: number | undefined | string): number | undefined => {
	const num = Number(order);
	if (Number.isNaN(num)) {
		return;
	}
	if (num < 0) {
		return;
	}
	return Math.floor(Math.max(num, 0));
};
