import type { ProductType } from '@atlaskit/linking-common/types';

export const isEmbedRovoActionsFooterExperimentEnabled = (product?: ProductType): boolean => {
	return product === 'CONFLUENCE';
};
