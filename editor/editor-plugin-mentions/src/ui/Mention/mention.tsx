import React, { useEffect, useState } from 'react';

import { MentionWithProfileCard } from '@atlaskit/editor-common/mention';
import { type ProfilecardProvider } from '@atlaskit/editor-common/src/provider-factory/profile-card-provider';
import type { MentionEventHandlers } from '@atlaskit/editor-common/ui';
import { browser } from '@atlaskit/editor-common/utils';
import { ResourcedMention } from '@atlaskit/mention/element';
import {
  isResolvingMentionProvider,
  type MentionNameDetails,
  MentionNameStatus,
  type MentionProvider,
} from '@atlaskit/mention/resource';
import { isPromise } from '@atlaskit/mention/types';

// Workaround for a firefox issue where dom selection is off sync
// https://product-fabric.atlassian.net/browse/ED-12442
const refreshBrowserSelection = () => {
  const domSelection = window.getSelection();
  if (domSelection) {
    const domRange =
      domSelection &&
      domSelection.rangeCount === 1 &&
      domSelection.getRangeAt(0).cloneRange();
    if (domRange) {
      domSelection.removeAllRanges();
      domSelection.addRange(domRange);
    }
  }
};

export interface MentionProps {
  id: string;
  eventHandlers?: MentionEventHandlers;
  text: string;
  accessLevel?: string;
  localId?: string;
  mentionProvider?: Promise<MentionProvider>;
  profilecardProvider?: Promise<ProfilecardProvider>;
}

/**
 * This is the new preferred way to render mentions in the editor.
 * Introduced behind the `platform.editor.mentions-in-editor-popup-on-click` feature flag.
 */
export const Mention = (props: MentionProps) => {
  const {
    accessLevel,
    eventHandlers,
    id,
    text,
    localId,
    mentionProvider,
    profilecardProvider: profilecardProviderPromise,
  } = props;

  const [profilecardProvider, setProfilecardProvider] = useState<
    ProfilecardProvider | undefined
  >(undefined);

  const resolvedName = useResolvedName(id, text, mentionProvider);

  // Resolve the profilecard provider
  useEffect(() => {
    let isCancelled = false;
    const resolveProfilecardProvider = async () => {
      try {
        const profilecardProvider = await profilecardProviderPromise;
        if (!isCancelled) {
          setProfilecardProvider(profilecardProvider);
        }
      } catch (error) {
        if (!isCancelled) {
          setProfilecardProvider(undefined);
        }
      }
    };

    if (profilecardProviderPromise) {
      resolveProfilecardProvider();
    }

    return () => {
      isCancelled = true;
    };
  }, [profilecardProviderPromise]);

  useEffect(() => {
    // Workaround an issue where the selection is not updated immediately after adding
    // a mention when "sanitizePrivateContent" is enabled in the editor on safari.
    // This affects both insertion and paste behaviour it is applied to the component.
    // https://product-fabric.atlassian.net/browse/ED-14859
    if (browser.safari) {
      setTimeout(refreshBrowserSelection, 0);
    }
  }, []);

  const actionHandlers: Record<string, () => void> = {};
  ['onClick', 'onMouseEnter', 'onMouseLeave'].forEach(handler => {
    actionHandlers[handler] =
      (eventHandlers && (eventHandlers as any)[handler]) || (() => {});
  });

  if (profilecardProvider) {
    return (
      <MentionWithProfileCard
        id={id}
        text={resolvedName}
        accessLevel={accessLevel}
        mentionProvider={mentionProvider}
        profilecardProvider={profilecardProvider}
        localId={localId}
        {...actionHandlers}
      />
    );
  } else {
    return (
      <ResourcedMention
        id={id}
        text={resolvedName}
        accessLevel={accessLevel}
        mentionProvider={mentionProvider}
        localId={localId}
        {...actionHandlers}
      />
    );
  }
};

const useResolvedName = (
  id: string,
  text: string,
  mentionProvider?: Promise<MentionProvider>,
) => {
  const [resolvedName, setResolvedName] = useState(text);

  const processName = (name: MentionNameDetails): string => {
    if (name.status === MentionNameStatus.OK) {
      return `@${name.name || ''}`;
    } else {
      return `@_|unknown|_`;
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
