import type { CardState } from '@atlaskit/linking-common';
import type { SmartLinkResponse } from '@atlaskit/linking-types';

const isValidPlaceholderData = (placeholderData: SmartLinkResponse) =>
	placeholderData?.data && 'url' in placeholderData.data && 'name' in placeholderData.data;

export const extractPlaceHolderCardState = (
	placeholderData: SmartLinkResponse,
): CardState | undefined => {
	return isValidPlaceholderData(placeholderData)
		? {
				status: 'resolved',
				metadataStatus: undefined,
				details: placeholderData,
			}
		: undefined;
};
