export function barrelKeyToExportsKey(barrelKey: string): string {
	if (barrelKey === '') {
		return '.';
	}
	if (barrelKey.startsWith('/')) {
		return '.' + barrelKey;
	}
	return './' + barrelKey;
}
