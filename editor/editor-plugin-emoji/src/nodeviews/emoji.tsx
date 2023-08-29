import React from 'react';

import { useIntl } from 'react-intl-next';

import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { InlineNodeViewComponentProps } from '@atlaskit/editor-common/react-node-view';

import { messages } from '../messages';
import Emoji from '../ui/Emoji';

const EmojiAssistiveTextComponent = React.memo(
  ({ emojiShortName }: { emojiShortName: string }) => {
    const intl = useIntl();
    return (
      <span className={'assistive'}>
        {`${intl.formatMessage(messages.emojiNodeLabel)} ${emojiShortName}`}
      </span>
    );
  },
);

export type Props = InlineNodeViewComponentProps & {
  providerFactory: ProviderFactory;
};

export function EmojiNodeView(props: Props) {
  const { shortName, id, text } = props.node.attrs;

  return (
    <>
      <EmojiAssistiveTextComponent
        emojiShortName={shortName}
      ></EmojiAssistiveTextComponent>
      <span aria-hidden="true">
        <Emoji
          providers={props.providerFactory}
          id={id}
          shortName={shortName}
          fallback={text}
        />
      </span>
    </>
  );
}
