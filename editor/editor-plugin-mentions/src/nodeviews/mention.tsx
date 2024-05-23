import React, { useEffect, useState } from 'react';

import {
  type ProviderFactory,
  useProvider,
} from '@atlaskit/editor-common/provider-factory';
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

const useResolvedName = ({
  id,
  text,
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

  return resolvedName;
};

export const MentionNodeView = (props: Props) => {
  const { id, text, accessLevel, localId } = props.node.attrs;
  const mentionProvider = useProvider('mentionProvider');
  const profilecardProvider = props.options?.profilecardProvider;

  const resolvedName = useResolvedName({ id, text, mentionProvider });

  return (
    <>
      <span>
        <Mention
          id={id}
          text={resolvedName}
          accessLevel={accessLevel}
          mentionProvider={mentionProvider}
          profilecardProvider={profilecardProvider}
          localId={localId}
        />
      </span>
    </>
  );
};
