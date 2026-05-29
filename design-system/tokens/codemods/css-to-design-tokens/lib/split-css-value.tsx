export function splitCssValue(value: string): RegExpMatchArray | null {
	const regex = /(?:[^\s()]+|\((?:[^()]+|\([^()]*\))*\))+/g;
	return value.match(regex);
}
