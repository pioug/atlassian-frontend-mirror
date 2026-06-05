import type { RichMediaLayout } from '@atlaskit/adf-schema';

import { wrappedLayouts } from '../ui/MediaSingle/wrappedLayouts';

export const shouldAddDefaultWrappedWidth = (
	layout: RichMediaLayout,
	width?: number,
	lineLength?: number,
): boolean | 0 | undefined => {
	return wrappedLayouts.indexOf(layout) > -1 && lineLength && width && width > 0.5 * lineLength;
};
