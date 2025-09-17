import { browser as browserLegacy, getBrowserInfo } from '@atlaskit/editor-common/browser';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

export function getUAPrefix() {
	const browser = expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
		? getBrowserInfo()
		: browserLegacy;
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
