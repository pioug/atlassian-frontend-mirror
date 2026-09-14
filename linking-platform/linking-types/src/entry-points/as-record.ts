export const asRecord = (value: unknown): Record<string | number | symbol, unknown> =>
	value as Record<string | number | symbol, unknown>;
