export const isOutdatedBrowser = (userAgent: string) => {
	// Take browsers in both Desktop and Mobile (includes Chrome, Firefox, Edge and Safari) within last 2 years
	const chrome = /Chrome\//.test(userAgent) && !/OPR\//.test(userAgent);
	const chromeVersion = chrome ? parseInt((userAgent.match(/Chrome\/(\d+)/) || [])[1], 10) : 0;
	if (chromeVersion >= 84) {
		return false;
	}

	const gecko = /gecko\/\d/i.test(userAgent);
	const geckoVersion = gecko ? parseInt((userAgent.match(/Firefox\/(\d+)/) || [])[1], 10) : 0;
	if (geckoVersion >= 84) {
		return false;
	}

	const edge = /Edge\/(\d+)/.exec(userAgent);
	const edgeVersion = edge ? +edge[1] : 0;
	if (edgeVersion >= 84) {
		return false;
	}

	const safari = !chrome && !gecko && /Version\/([0-9\._]+).*Safari/.test(userAgent);
	const safariVersion = safari
		? parseInt((userAgent.match(/Version\/([0-9\._]+).*Safari/) || [])[1], 10)
		: 0;
	if (safariVersion >= 12) {
		return false;
	}

	return true;
};
