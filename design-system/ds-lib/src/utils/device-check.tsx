function testPlatform(re: RegExp) {
	return typeof window !== 'undefined' && window.navigator != null
		? re.test((window.navigator as any)['userAgentData']?.platform || window.navigator.platform)
		: false;
}

function isIPhone() {
	return testPlatform(/^iPhone/i);
}

function isIPad() {
	return (
		testPlatform(/^iPad/i) ||
		// iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
		(isMac() && navigator.maxTouchPoints > 1)
	);
}

function isMac() {
	return testPlatform(/^Mac/i);
}
function isIOS() {
	return isIPhone() || isIPad();
}

export function isAppleDevice(): boolean {
	return isMac() || isIOS();
}
