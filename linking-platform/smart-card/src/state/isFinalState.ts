import type { CardType } from '@atlaskit/linking-common/types';

export const isFinalState = (status: CardType): boolean => {
	return ['unauthorized', 'forbidden', 'errored', 'resolved', 'not_found'].indexOf(status) > -1;
};
