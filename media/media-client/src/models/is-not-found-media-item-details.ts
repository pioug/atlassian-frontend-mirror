import type { NotFoundMediaItemDetails } from './media';

export const isNotFoundMediaItemDetails = (
	itemDetails: any,
): itemDetails is NotFoundMediaItemDetails => {
	return 'type' in itemDetails && itemDetails.type === 'not-found';
};
