import React from 'react';
import { ReactionPicker, UfoErrorBoundary } from '../components';
import type { Props as ReactionsViewProps } from './ConnectedReactionsView';
import { ReactionConsumer } from '../store/ReactionConsumer';
import { UFO } from '../analytics';
import { Actions } from '../types';

export type Props = ReactionsViewProps & {
  miniMode?: boolean;
  className?: string;
};

/**
 * UFO Instance for picker
 */
export const ConnectedReactionPicker: React.FC<Props> = (props) => {
  const renderChild = (innerProps: any) => {
    return <ReactionPicker {...props} {...innerProps} />;
  };

  const actionsMapper = (actions: Actions) => ({
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
