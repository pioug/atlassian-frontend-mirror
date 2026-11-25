import type { KeyValues } from '@atlaskit/util-service-support/types';

export const calculateScale = (getRatio: () => number): KeyValues => {
	// retina display
	if (getRatio() > 1) {
		return { scale: 'XXXHDPI', altScale: 'XXXHDPI' };
	}
	// default set used for desktop
	return { altScale: 'XXXHDPI' };
};
