import { EmojiProvider } from '@atlaskit/emoji/resource';
import React from 'react';
import { ReactionPicker } from '../components/ReactionPicker';
import {
  Actions,
  ReactionConsumer,
  ReactionStoreProp,
} from '../reaction-store/ReactionConsumer';

export type Props = {
  containerAri: string;
  ari: string;
  emojiProvider: Promise<EmojiProvider>;
  miniMode?: boolean;
  boundariesElement?: string;
  className?: string;
  allowAllEmojis?: boolean;
  store: ReactionStoreProp;
};

export default class ReactionPickerContainer extends React.PureComponent<
  Props
> {
  private renderChild = (props: any) => (
    <ReactionPicker {...this.props} {...props} />
  );

  private actionsMapper = (actions: Actions) => ({
    onSelection: (emojiId: string) => {
      actions.addReaction(this.props.containerAri, this.props.ari, emojiId);
    },
  });

  render() {
    return (
      <ReactionConsumer
        store={this.props.store}
        actionsMapper={this.actionsMapper}
      >
        {this.renderChild}
      </ReactionConsumer>
    );
  }
}
