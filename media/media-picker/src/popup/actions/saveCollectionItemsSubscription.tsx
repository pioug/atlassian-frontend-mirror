import { Action } from 'redux';
import { MediaSubscription } from '@atlaskit/media-client';

export const SAVE_COLLECTION_ITEMS_SUBSCRIPTION =
  'SAVE_COLLECTION_ITEMS_SUBSCRIPTION';

export interface SaveCollectionItemsSubscriptionAction extends Action {
  type: 'SAVE_COLLECTION_ITEMS_SUBSCRIPTION';
  subscription: MediaSubscription;
}

export function saveCollectionItemsSubscription(
  subscription: MediaSubscription,
): SaveCollectionItemsSubscriptionAction {
  return {
    type: SAVE_COLLECTION_ITEMS_SUBSCRIPTION,
    subscription,
  };
}
