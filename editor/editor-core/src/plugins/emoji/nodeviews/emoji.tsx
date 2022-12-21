import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

import type { InlineNodeViewComponentProps } from '../../../nodeviews/getInlineNodeViewProducer';

import Emoji from '../ui/Emoji';
import { useIntl } from 'react-intl-next';
import { messages } from '../messages';

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
