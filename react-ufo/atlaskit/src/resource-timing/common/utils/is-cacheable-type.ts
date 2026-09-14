const alwaysCacheableTypes = ['script', 'link'];

export function isCacheableType(url: string, type: string): boolean {
	if (alwaysCacheableTypes.includes(type)) {
		return true;
	}

	if (type === 'other' && url.includes('.js')) {
		return true;
	}

	return false;
}
