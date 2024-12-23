import format from '@af/formatting/sync';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sortObjectKeys(obj: Record<string, any>): Record<string, any> {
	const sortedKeys = Object.keys(obj).sort();
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const sortedObj: Record<string, any> = {};

	for (const key of sortedKeys) {
		sortedObj[key] = obj[key];
	}

	return sortedObj;
}

export function formatCode(code: string): string {
	return format(code, 'typescript');
}
