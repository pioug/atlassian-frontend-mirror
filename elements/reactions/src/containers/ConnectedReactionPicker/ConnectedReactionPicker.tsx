import React from 'react';
import {
  ReactionPicker,
  ReactionPickerProps,
  UfoErrorBoundary,
} from '../../components';
import { StorePropInput } from '../../types';
import { PickerRender } from '../../ufo';

export interface ConnectedReactionPickerProps
  extends Omit<ReactionPickerProps, 'onSelection'> {
  /**
   * Wrapper id for reactions list
   */
  containerAri: string;
  /**
   * Individual id for a reaction
   */
  ari: string;
  /**
   * Reference to the store.
   * @remarks
   * This was initially implemented with a sync and Async versions and will be replaced with just a sync Store in a future release (Please use only the sync version)
   */
  store: StorePropInput;
}

/**
 * Reaction Picker component
 */
export const ConnectedReactionPicker = (
  props: React.PropsWithChildren<ConnectedReactionPickerProps>,
) => {
  const { store, containerAri, ari } = props;
  /**
   * callback event when an emoji item is selected
   * @param emojiId unique id for the reaction emoji
   */
  const onSelection = (emojiId: string) => {
    (async () => {
      const _store = await Promise.resolve(store);
      _store.addReaction(containerAri, ari, emojiId);
    })();
  };

  return (
    <UfoErrorBoundary experiences={[PickerRender]}>
      <ReactionPicker {...props} onSelection={onSelection} />
    </UfoErrorBoundary>
  );
};
