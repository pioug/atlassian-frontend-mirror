import type { NumericalCardDimensions } from '@atlaskit/media-common/main-types';

import { type MediaFilePreviewErrorInfo } from '../analytics';

export type MediaCardSsrData = {
	dataURI?: string;
	dimensions?: Partial<NumericalCardDimensions>;
	error?: MediaFilePreviewErrorInfo;
	mode?: string;
	srcSet?: string;
	loadPromise?: Promise<void>;
	loading?: 'lazy' | '';
};

export type MediaCardSsr = Record<string, MediaCardSsrData>;
