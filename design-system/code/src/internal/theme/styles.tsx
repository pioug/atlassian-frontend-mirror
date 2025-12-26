export const getLineNumWidth = (numLines: number): string => {
	return !numLines ? '1ch' : `${numLines.toFixed(0).length}ch`;
};
