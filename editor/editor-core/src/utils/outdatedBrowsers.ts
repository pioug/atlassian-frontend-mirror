/* eslint-disable require-unicode-regexp */

const CHROME_REGEX = /Chrome\//;
const OPR_REGEX = /OPR\//;
const CHROME_VERSION_REGEX = /Chrome\/(\d+)/;
const GECKO_REGEX = /gecko\/\d/i;
const FIREFOX_VERSION_REGEX = /Firefox\/(\d+)/;
const EDGE_REGEX = /Edge\/(\d+)/;
const SAFARI_REGEX = /Version\/([0-9._]+).*Safari/;

export const isOutdatedBrowser = (userAgent: string): boolean => {
	// Take browsers in both Desktop and Mobile (includes Chrome, Firefox, Edge and Safari) within last 2 years
	const chrome = CHROME_REGEX.test(userAgent) && !OPR_REGEX.test(userAgent);
	const chromeVersion = chrome ? parseInt((userAgent.match(CHROME_VERSION_REGEX) || [])[1], 10) : 0;
	if (chromeVersion >= 123) {
		return false;
	}

	const gecko = GECKO_REGEX.test(userAgent);
	const geckoVersion = gecko ? parseInt((userAgent.match(FIREFOX_VERSION_REGEX) || [])[1], 10) : 0;
	if (geckoVersion >= 124) {
		return false;
	}

	const edge = EDGE_REGEX.exec(userAgent);
	const edgeVersion = edge ? +edge[1] : 0;
	if (edgeVersion >= 123) {
		return false;
	}

	const safari = !chrome && !gecko && SAFARI_REGEX.test(userAgent);
	const safariVersion = safari
		? parseInt((userAgent.match(SAFARI_REGEX) || [])[1], 10)
		: 0;
	if (safariVersion >= 17) {
		return false;
	}

	return true;
};
