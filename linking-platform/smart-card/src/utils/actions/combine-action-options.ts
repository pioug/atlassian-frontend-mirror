import { CardAction, type CardActionOptions, type CardPlatform } from '../../view/Card/types';

type CombineActionsOptions = {
	actionOptions?: CardActionOptions;
	showServerActions?: boolean;
	showActions?: boolean;
	platform?: CardPlatform;
	hidePreviewButton?: boolean;
};

export const combineActionOptions = ({
	actionOptions,
	showServerActions,
	showActions,
	platform,
	hidePreviewButton,
}: CombineActionsOptions): CardActionOptions => {
	if (typeof actionOptions !== 'undefined') {
		return actionOptions;
	}

	if (platform === 'mobile' || (showServerActions === false && showActions === false)) {
		return { hide: true };
	}

	let exclude: Array<CardAction> = [];

	if (hidePreviewButton) {
		exclude = [...exclude, CardAction.PreviewAction];
	}

	if (showServerActions && showActions) {
		return { hide: false, exclude };
	}

	if (showServerActions === false) {
		exclude = [...exclude, CardAction.FollowAction, CardAction.ChangeStatusAction];
	}

	if (showActions === false) {
		exclude = [...exclude, CardAction.DownloadAction, CardAction.ViewAction];

		if (!exclude.includes(CardAction.PreviewAction)) {
			exclude.push(CardAction.PreviewAction);
		}
	}

	return {
		hide: false,
		exclude,
	};
};
