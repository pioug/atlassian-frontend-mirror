import type { CardAction, CardActionOptions } from '../../view/Card/types';

export const canShowAction = (action: CardAction, actionOptions?: CardActionOptions): boolean => {
	if (typeof actionOptions === 'undefined') {
		return true;
	}

	if (actionOptions.hide || actionOptions.exclude?.includes(action)) {
		return false;
	}

	return true;
};
