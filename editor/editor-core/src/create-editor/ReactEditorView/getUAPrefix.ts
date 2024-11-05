import { browser } from '@atlaskit/editor-common/browser';

export function getUAPrefix() {
	if (browser.chrome) {
		return 'ua-chrome';
	} else if (browser.ie) {
		return 'ua-ie';
	} else if (browser.gecko) {
		return 'ua-firefox';
	} else if (browser.safari) {
		return 'ua-safari';
	}
	return '';
}
