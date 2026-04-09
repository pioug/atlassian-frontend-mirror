export const isHexColor = (value: string): boolean =>
	/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value);
