import { type CardAction, type CardActionOptions, type CardPlatform } from '../../view/Card/types';

type CombineActionsOptions = {
	actionOptions?: CardActionOptions;
	platform?: CardPlatform;
};

export const combineActionOptions = ({
	actionOptions,
	platform,
}: CombineActionsOptions): CardActionOptions => {
	if (typeof actionOptions !== 'undefined') {
		return actionOptions;
	}

	if (platform === 'mobile') {
		return { hide: true };
	}

	let exclude: Array<CardAction> = [];

	return {
		hide: false,
		exclude,
	};
};
