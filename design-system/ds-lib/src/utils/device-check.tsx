function testPlatform(re: RegExp) {
	return typeof window !== 'undefined' && window.navigator != null
		? re.test((window.navigator as any)['userAgentData']?.platform || window.navigator.platform)
		: false;
}

function isIPhone() {
	return testPlatform(/^iPhone/i);
}

function isMac() {
	return testPlatform(/^Mac/i);
}

function isIPad() {
	return (
		testPlatform(/^iPad/i) ||
		// iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
		(isMac() && navigator.maxTouchPoints > 1)
	);
}

function isIOS() {
	return isIPhone() || isIPad();
}

export function isSafari(): boolean {
	if (typeof window !== 'undefined' && window.navigator != null) {
		const ua = window.navigator.userAgent?.toLowerCase();
		return ua ? ua.includes('safari') && !ua.includes('chrome') : false;
	}
	return false;
}

export function isAppleDevice(): boolean {
	return isMac() || isIOS();
}
