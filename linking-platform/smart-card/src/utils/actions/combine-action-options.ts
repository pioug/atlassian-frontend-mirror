import {
  CardAction,
  type CardPlatform,
  type CardActionOptions,
} from '../../view/Card/types';

export const combineActionOptions = (
  actionOptions?: CardActionOptions,
  showServerActions?: boolean,
  showActions?: boolean,
  platform?: CardPlatform,
): CardActionOptions => {
  if (typeof actionOptions !== 'undefined') {
    return actionOptions;
  }

  if (
    platform === 'mobile' ||
    (showServerActions === false && showActions === false)
  ) {
    return { hide: true };
  }

  if (showServerActions && showActions) {
    return { hide: false };
  }

  let exclude: Array<CardAction> = [];

  if (showServerActions === false) {
    exclude = [
      ...exclude,
      CardAction.FollowAction,
      CardAction.ChangeStatusAction,
    ];
  }

  if (showActions === false) {
    exclude = [
      ...exclude,
      CardAction.DownloadAction,
      CardAction.PreviewAction,
      CardAction.ViewAction,
    ];
  }

  return {
    hide: false,
    exclude,
  };
};
