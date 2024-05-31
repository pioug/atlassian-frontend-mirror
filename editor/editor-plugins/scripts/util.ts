import format from '@af/formatting/sync';

export function sortObjectKeys(obj: Record<string, any>): Record<string, any> {
	const sortedKeys = Object.keys(obj).sort();
	const sortedObj: Record<string, any> = {};

	for (const key of sortedKeys) {
		sortedObj[key] = obj[key];
	}

	return sortedObj;
}

export function formatCode(code: string): string {
	return format(code, 'typescript');
}
