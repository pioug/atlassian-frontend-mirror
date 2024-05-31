import type { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';

import type { GridType } from '../types';

export const gridTypeForLayout = (layout: MediaSingleLayout): GridType =>
	layout === 'wrap-left' || layout === 'wrap-right' ? 'wrapped' : 'full';
