export const getLineNumWidth = (numLines: number) => {
	return !numLines ? '1ch' : `${numLines.toFixed(0).length}ch`;
};
