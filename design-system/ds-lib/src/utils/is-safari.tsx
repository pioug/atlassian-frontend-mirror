export function isSafari(): boolean {
	if (typeof window !== 'undefined' && window.navigator != null) {
		const ua = window.navigator.userAgent?.toLowerCase();
		return ua ? ua.includes('safari') && !ua.includes('chrome') : false;
	}
	return false;
}
