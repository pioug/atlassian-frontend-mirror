import React from 'react';
import {
  ReactionPicker,
  ReactionPickerProps,
  UfoErrorBoundary,
} from '../../components';
import { UFO } from '../../analytics';
import { StorePropInput } from '../../types';

export interface ConnectedReactionPickerProps
  extends Omit<ReactionPickerProps, 'onSelection'> {
  /**
   * Optional Show the "more emoji" selector icon for choosing emoji beyond the default list of emojis (defaults to false)
   */
  allowAllEmojis?: boolean;
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
export const ConnectedReactionPicker: React.FC<ConnectedReactionPickerProps> = (
  props,
) => {
  /**
   * callback event when an emoji item is selected
   * @param emojiId unique id for the reaction emoji
   */
  const onSelection = (emojiId: string) => {
    (async () => {
      const _store = await Promise.resolve(props.store);
      _store.addReaction(props.containerAri, props.ari, emojiId);
    })();
  };

  return (
    <UfoErrorBoundary experiences={[UFO.PickerRender]}>
      <ReactionPicker {...props} onSelection={onSelection} />
    </UfoErrorBoundary>
  );
};
