import React from 'react';
import { ReactionPicker, UfoErrorBoundary } from '../components';
import type { Props as ConnectedReactionsViewProps } from './ConnectedReactionsView';
import { ReactionConsumer } from '../store/ReactionConsumer';
import { UFO } from '../analytics';
import { Actions } from '../types';

export type ConnectedReactionPickerProps = ConnectedReactionsViewProps & {
  /**
   * apply "miniMode" className to the <ReactionPicker /> component (defaults to false)
   */
  miniMode?: boolean;
  /**
   * Optional Classname for the reaction picker
   */
  className?: string;
};

/**
 * UFO Instance for picker
 */
export const ConnectedReactionPicker: React.FC<ConnectedReactionPickerProps> = (
  props,
) => {
  const renderChild = (innerProps: any) => {
    return <ReactionPicker {...props} {...innerProps} />;
  };

  /**
   * Mapping actions for the picker selection
   * @param actions
   * @returns void
   */
  const actionsMapper = (actions: Pick<Actions, 'addReaction'>) => ({
    /**
     * Event handler when an emoji gets selected
     */
    onSelection: (emojiId: string) => {
      actions.addReaction(props.containerAri, props.ari, emojiId);
    },
  });

  return (
    <UfoErrorBoundary experiences={[UFO.PickerRender]}>
      <ReactionConsumer store={props.store} actionsMapper={actionsMapper}>
        {renderChild}
      </ReactionConsumer>
    </UfoErrorBoundary>
  );
};
