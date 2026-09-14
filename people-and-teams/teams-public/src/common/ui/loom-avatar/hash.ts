import stringHash from 'string-hash';

export const hash = (str: string): number => {
	let hash = stringHash(str);

	hash = ~hash;

	return Math.abs(Number(hash));
};
