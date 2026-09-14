// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const copy = <T extends Record<string | number, any> = Record<string | number, any>>(
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	source: Record<string | number, any>,
	dest: T,
	key: string | number,
): T => {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(dest as Record<string | number, any>)[key] = source[key];
	return dest;
};
