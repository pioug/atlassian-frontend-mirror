import { Action } from 'redux';
import { Subscription } from 'rxjs/Subscription';

export const SAVE_COLLECTION_ITEMS_SUBSCRIPTION =
  'SAVE_COLLECTION_ITEMS_SUBSCRIPTION';

export interface SaveCollectionItemsSubscriptionAction extends Action {
  type: 'SAVE_COLLECTION_ITEMS_SUBSCRIPTION';
  subscription: Subscription;
}

export function saveCollectionItemsSubscription(
  subscription: Subscription,
): SaveCollectionItemsSubscriptionAction {
  return {
    type: SAVE_COLLECTION_ITEMS_SUBSCRIPTION,
    subscription,
  };
}
