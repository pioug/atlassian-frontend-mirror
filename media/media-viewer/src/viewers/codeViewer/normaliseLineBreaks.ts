export const normaliseLineBreaks = (text: string): string =>
	text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
