import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import Mention from '../ui/Mention';
import { MentionPluginOptions } from '../types';
import { InlineNodeViewComponentProps } from '../../../nodeviews/getInlineNodeViewProducer';
import { useIntl } from 'react-intl-next';
import { messages } from '../messages';

export type Props = InlineNodeViewComponentProps & {
  options: MentionPluginOptions | undefined;
  providerFactory: ProviderFactory;
};

const MentionAssistiveTextComponent = React.memo(
  ({ mentionedName }: { mentionedName: string }) => {
    const intl = useIntl();
    return (
      <span className={'assistive'}>
        {`${intl.formatMessage(messages.mentionsNodeLabel)} ${mentionedName}`}
      </span>
    );
  },
);

export const MentionNodeView: React.FC<Props> = (props) => {
  const { providerFactory } = props;
  const { id, text, accessLevel } = props.node.attrs;

  return (
    <>
      <MentionAssistiveTextComponent
        mentionedName={text}
      ></MentionAssistiveTextComponent>
      <span aria-hidden="true">
        <Mention
          id={id}
          text={text}
          accessLevel={accessLevel}
          providers={providerFactory}
        />
      </span>
    </>
  );
};
