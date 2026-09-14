export const normalizeText: any = (text: string): string =>
	text.toLowerCase().replace(/\s+/g, ' ').trim();
