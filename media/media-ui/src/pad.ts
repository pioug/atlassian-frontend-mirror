export const pad = (n: number): string | number => {
	return n < 10 ? `0${n}` : n;
};
