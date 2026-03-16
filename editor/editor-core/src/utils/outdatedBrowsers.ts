/* eslint-disable require-unicode-regexp */

import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

export const isOutdatedBrowser = (userAgent: string): boolean => {
	// Take browsers in both Desktop and Mobile (includes Chrome, Firefox, Edge and Safari) within last 2 years
	const chrome = /Chrome\//.test(userAgent) && !/OPR\//.test(userAgent);
	const chromeVersion = chrome ? parseInt((userAgent.match(/Chrome\/(\d+)/) || [])[1], 10) : 0;
	if (
		expValEquals('platform_editor_outdated_browser_update', 'isEnabled', true)
			? chromeVersion >= 123
			: chromeVersion >= 84
	) {
		return false;
	}

	const gecko = /gecko\/\d/i.test(userAgent);
	const geckoVersion = gecko ? parseInt((userAgent.match(/Firefox\/(\d+)/) || [])[1], 10) : 0;
	if (
		expValEquals('platform_editor_outdated_browser_update', 'isEnabled', true)
			? geckoVersion >= 124
			: geckoVersion >= 84
	) {
		return false;
	}

	const edge = /Edge\/(\d+)/.exec(userAgent);
	const edgeVersion = edge ? +edge[1] : 0;
	if (
		expValEquals('platform_editor_outdated_browser_update', 'isEnabled', true)
			? edgeVersion >= 123
			: edgeVersion >= 84
	) {
		return false;
	}

	const safari = !chrome && !gecko && /Version\/([0-9\._]+).*Safari/.test(userAgent);
	const safariVersion = safari
		? parseInt((userAgent.match(/Version\/([0-9\._]+).*Safari/) || [])[1], 10)
		: 0;
	if (
		expValEquals('platform_editor_outdated_browser_update', 'isEnabled', true)
			? safariVersion >= 17
			: safariVersion >= 12
	) {
		return false;
	}

	return true;
};
