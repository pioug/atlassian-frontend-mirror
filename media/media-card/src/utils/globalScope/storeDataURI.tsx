import { type NumericalCardDimensions } from '@atlaskit/media-common';

import { type MediaCardErrorInfo } from '../analytics';
import { getMediaCardSSR } from './getMediaCardSSR';

export const storeDataURI = (
	key: string,
	dataURI?: string,
	dimensions?: Partial<NumericalCardDimensions>,
	error?: MediaCardErrorInfo,
	globalScope: any = window,
): void => {
	const mediaCardSsr = getMediaCardSSR(globalScope);
	mediaCardSsr[key] = { dataURI, dimensions, error };
};
