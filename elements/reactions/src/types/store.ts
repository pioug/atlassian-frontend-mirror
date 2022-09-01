import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { Actions } from './Actions';
import { ReactionsState } from './reaction';

/**
 * Callback event when changes apply to the main store
 * @param state latest store state
 */
export type OnChangeCallback = (state: State) => void;

/**
 * Map of state props
 */
export interface StoreProps {
  /**
   * Get current state of the stor
   */
  getState: () => State;
  /**
   * Register a callbsack event on change to the store instance state data
   * @param callback event to register
   * @deprecated initially implemented by the MemoryReactionsStore class and kept. This will be removed in a future release
   */
  onChange: (callback: OnChangeCallback) => void;
  /**
   * Deregister any callback event on changes to the store instance state data
   * @param callback event to de-register
   * @deprecated initially implemented by the MemoryReactionsStore class and kept. This will be removed in a future release
   */
  removeOnChangeListener: (callback: OnChangeCallback) => void;
  /**
   * Add Atlaskit analytics events to different operations in the store
   * @param createAnalyticsEvent analytics event trigger
   * @deprecated initially implemented by the MemoryReactionsStore class and kept. This will be removed in a future release
   */
  setCreateAnalyticsEvent?: (
    createAnalyticsEvent: CreateUIAnalyticsEvent,
  ) => void;
}

/**
 * General Interface for a reaction store
 */
export interface Store extends Actions, StoreProps {}

/**
 * the "store" prop option to the connected view and picker components
 */
export type StorePropInput = Store | Promise<Store>; //This was needed due to external components consuming the @atlaskit/reactions library, passing a Promise instance of a store (TODO: replace all referemces to that to use just a sync Store variable)

/**
 * store main structure
 */
export type State = {
  /**
   * collection of the different reactions (key => unique reaction id , value => state of the reaction)
   */
  reactions: {
    [key: string]: ReactionsState;
  };
  /**
   * custom animation for given emojis as true|false (key => unique reaction id, value => collection of emojiIds and true|false to apply custom animation)
   */
  flash: {
    [key: string]: {
      [emojiId: string]: boolean;
    };
  };
};
