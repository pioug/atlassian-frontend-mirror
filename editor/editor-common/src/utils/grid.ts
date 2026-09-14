import type { Layout as MediaSingleLayout } from '@atlaskit/adf-schema/rich-media-common';

import type { GridType } from '../types';

export const gridTypeForLayout = (layout: MediaSingleLayout): GridType =>
	layout === 'wrap-left' || layout === 'wrap-right' ? 'wrapped' : 'full';
