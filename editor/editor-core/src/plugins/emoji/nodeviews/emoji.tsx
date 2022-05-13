import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

import type { InlineNodeViewComponentProps } from '../../../nodeviews/getInlineNodeViewProducer';

import Emoji from '../ui/Emoji';

export type Props = InlineNodeViewComponentProps & {
  providerFactory: ProviderFactory;
};

export function EmojiNodeView(props: Props) {
  const { shortName, id, text } = props.node.attrs;

  return (
    <Emoji
      providers={props.providerFactory}
      id={id}
      shortName={shortName}
      fallback={text}
    />
  );
}
