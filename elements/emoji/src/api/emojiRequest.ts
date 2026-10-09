import { utils as serviceUtils } from '@atlaskit/util-service-support/constants';
import type { KeyValues, RequestServiceOptions } from '@atlaskit/util-service-support/types';

import { type EmojiServiceResponse } from '../types';
import { calculateScale } from './calculateScale';
import type { EmojiLoaderConfig } from './EmojiUtils';
import { getPixelRatio } from './getPixelRatio';

export const emojiRequest = (
	provider: EmojiLoaderConfig,
	options?: RequestServiceOptions,
): Promise<EmojiServiceResponse> => {
	const { getRatio = getPixelRatio, ...serviceConfig } = provider;
	const scaleQueryParams: KeyValues = calculateScale(getRatio);
	const { queryParams = {}, ...otherOptions } = options || {};
	const requestOptions = {
		...otherOptions,
		queryParams: {
			...scaleQueryParams,
			...queryParams,
			preferredRepresentation: 'IMAGE',
		},
	};
	return serviceUtils.requestService<EmojiServiceResponse>(serviceConfig, requestOptions);
};
