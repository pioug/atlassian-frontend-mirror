export function isValid(timeString: string): boolean {
	/**
	 * Regex match for `12:34`, `12:34:56`, `1:23:56 p`, `1:23:56PM`, and a bit more…
	 */
	const time = timeString
		.trim()
		.match(/([012]?[\d])(?::([0-5][\d]))?(?::([0-5][\d]))?\s*([ap]m?)?/i);

	/**
	 * Regex match for `1234`, `12:34`, `12.34`, `123456`, `12:34:56`, `12.34.56`
	 */
	const time24hr = timeString.trim().match(/([012][\d])[:.]?([0-5][\d])([:.]?([0-5][\d]))?/);

	/**
	 * Convert `2:34:56 pm` down to `23456`
	 */
	const num = timeString.replace(/[^0-9]/g, '');

	const includesSeconds =
		(time && time[1] !== undefined && time[2] !== undefined && time[3] !== undefined) ||
		(time24hr &&
			time24hr[1] !== undefined &&
			time24hr[2] !== undefined &&
			time24hr[4] !== undefined);

	if (!time && !time24hr) {
		return false;
	}
	if (time && !time[1]) {
		return false;
	}
	if (num.length > 6) {
		return false;
	}
	if (num.length > 4 && !includesSeconds) {
		return false;
	}
	if (num.length === 2 && parseInt(num, 10) > 12) {
		return false;
	}
	return true;
}
