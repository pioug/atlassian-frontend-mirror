import { CardAction, type CardActionOptions, type CardPlatform } from '../../view/Card/types';

type CombineActionsOptions = {
	actionOptions?: CardActionOptions;
	platform?: CardPlatform;
	hidePreviewButton?: boolean;
};

export const combineActionOptions = ({
	actionOptions,
	platform,
	hidePreviewButton,
}: CombineActionsOptions): CardActionOptions => {
	if (typeof actionOptions !== 'undefined') {
		return actionOptions;
	}

	if (platform === 'mobile') {
		return { hide: true };
	}

	let exclude: Array<CardAction> = [];

	if (hidePreviewButton) {
		exclude = [...exclude, CardAction.PreviewAction];
	}

	return {
		hide: false,
		exclude,
	};
};
