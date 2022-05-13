import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import Mention from '../ui/Mention';
import { MentionPluginOptions } from '../types';
import { InlineNodeViewComponentProps } from '../../../nodeviews/getInlineNodeViewProducer';

export type Props = InlineNodeViewComponentProps & {
  options: MentionPluginOptions | undefined;
  providerFactory: ProviderFactory;
};

export const MentionNodeView: React.FC<Props> = (props) => {
  const { providerFactory } = props;
  const { id, text, accessLevel } = props.node.attrs;

  return (
    <Mention
      id={id}
      text={text}
      accessLevel={accessLevel}
      providers={providerFactory}
    />
  );
};
