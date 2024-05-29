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
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import type { MentionPluginOptions } from '../types';
import Mention from '../ui/Mention';
import type { MentionProps } from '../ui/Mention';
import { Mention as MentionNext } from '../ui/Mention/mention';

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
  localId,
}: MentionProps & {
  mentionProvider?: Promise<MentionProvider>;
}) => {
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
          localId={localId}
        />
      </span>
    </>
  );
};

export const MentionNodeView = (props: Props) => {
  const { providerFactory } = props;
  const { id, text, accessLevel, localId } = props.node.attrs;

  const renderAssistiveTextWithProviders = (providers: Providers) => {
    const { mentionProvider } = providers as {
      mentionProvider?: Promise<MentionProvider>;
    };
    const profilecardProvider = getBooleanFF(
      'platform.editor.mentions-in-editor-popup-on-click',
    )
      ? props.options?.profilecardProvider
      : undefined;

    if (profilecardProvider) {
      return (
        /**
         * Rename this to `Mention` when `platform.editor.mentions-in-editor-popup-on-click` is tidied up.
         */
        <MentionNext
          id={id}
          text={text}
          accessLevel={accessLevel}
          mentionProvider={mentionProvider}
          profilecardProvider={profilecardProvider}
          localId={localId}
        />
      );
    } else {
      return (
        <MentionAssistiveTextComponent
          mentionProvider={mentionProvider}
          id={id}
          text={text}
          providers={providerFactory}
          accessLevel={accessLevel}
          localId={localId}
        />
      );
    }
  };

  return (
    <WithProviders
      providers={['mentionProvider', 'profilecardProvider']}
      providerFactory={providerFactory}
      renderNode={renderAssistiveTextWithProviders}
    />
  );
};
