import type { CardType } from '@atlaskit/linking-common/types';

export const getDisplayCategory = (status?: CardType): 'smartLink' | 'link' => {
	return !status || status !== 'not_found' ? 'smartLink' : 'link';
};
