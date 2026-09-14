export function exportsKeyToBarrelKey(exportsKey: string): string {
	if (exportsKey === '.' || exportsKey === './') {
		return '';
	}
	if (exportsKey.startsWith('./')) {
		return '/' + exportsKey.slice(2);
	}
	return '/' + exportsKey;
}
