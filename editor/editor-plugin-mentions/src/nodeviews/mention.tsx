import React, { useEffect, useState } from 'react';

import type {
  ProviderFactory,
  Providers,
} from '@atlaskit/editor-common/provider-factory';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import type { InlineNodeViewComponentProps } from '@atlaskit/editor-common/react-node-view';
import type { MentionNameDetails, MentionProvider } from '@atlaskit/mention';
import {
  isResolvingMentionProvider,
  MentionNameStatus,
} from '@atlaskit/mention';
import { isPromise } from '@atlaskit/mention/types';

import type { MentionPluginOptions } from '../types';
import Mention from '../ui/Mention';
import type { MentionProps } from '../ui/Mention';

export type Props = InlineNodeViewComponentProps & {
  options: MentionPluginOptions | undefined;
  providerFactory: ProviderFactory;
};

const UNKNOWN_USER_ID = '_|unknown|_';

const MentionAssistiveTextComponent = ({
  id,
  text,
  providers,
  accessLevel,
  mentionProvider,
}: MentionProps & { mentionProvider?: Promise<MentionProvider> }) => {
  const [resolvedName, setResolvedName] = useState(text);

  const processName = (name: MentionNameDetails): string => {
    if (name.status === MentionNameStatus.OK) {
      return `@${name.name || ''}`;
    } else {
      return `@${UNKNOWN_USER_ID}`;
    }
  };

  useEffect(() => {
    if (mentionProvider) {
      mentionProvider
        .then(async provider => {
          if (!text && isResolvingMentionProvider(provider)) {
            const nameDetail = provider.resolveMentionName(id);
            if (isPromise(nameDetail)) {
              return processName(await nameDetail);
            } else {
              return processName(nameDetail);
            }
          } else {
            return text;
          }
        })
        .then(resolvedName => {
          setResolvedName(resolvedName);
        });
    }
  }, [id, text, mentionProvider]);

  return (
    <>
      <span>
        <Mention
          id={id}
          text={resolvedName}
          accessLevel={accessLevel}
          providers={providers}
        />
      </span>
    </>
  );
};

export const MentionNodeView: React.FC<Props> = props => {
  const { providerFactory } = props;
  const { id, text, accessLevel } = props.node.attrs;

  const renderAssistiveTextWithProviders = (providers: Providers) => {
    const { mentionProvider } = providers as {
      mentionProvider?: Promise<MentionProvider>;
    };

    return (
      <MentionAssistiveTextComponent
        mentionProvider={mentionProvider}
        id={id}
        text={text}
        providers={providerFactory}
        accessLevel={accessLevel}
      />
    );
  };

  return (
    <WithProviders
      providers={['mentionProvider', 'profilecardProvider']}
      providerFactory={providerFactory}
      renderNode={renderAssistiveTextWithProviders}
    />
  );
};
