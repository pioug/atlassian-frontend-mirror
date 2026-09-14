import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { type KeyValues } from '@atlaskit/util-service-support';

export const calculateScale = (getRatio: () => number): KeyValues => {
	if (expValEquals('platform_editor_emoji_default_scale', 'isEnabled', true)) {
		// retina display
		if (getRatio() > 1) {
			return { scale: 'XXXHDPI', altScale: 'XXXHDPI' };
		}
		// default set used for desktop
		return { altScale: 'XXXHDPI' };
	}

	// Retina display
	if (getRatio() > 1) {
		return { scale: 'XHDPI', altScale: 'XXXHDPI' };
	}
	// Default set used for desktop
	return { altScale: 'XHDPI' };
};
