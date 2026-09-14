type srcType = 'blob' | 'remote' | 'data' | 'unknown';

/**
 * Classifies the failed `<img>` source into a coarse, non-sensitive enum so we can
 * tell which kind of source failed without leaking the (potentially signed) url.
 */
export function classifyFailedSrc(currentSrc?: string): srcType {
	if (!currentSrc) {
		return 'unknown';
	}
	if (currentSrc.startsWith('blob:')) {
		return 'blob';
	}
	if (currentSrc.startsWith('data:')) {
		return 'data';
	}
	if (currentSrc.startsWith('http:') || currentSrc.startsWith('https:')) {
		return 'remote';
	}
	return 'unknown';
}
