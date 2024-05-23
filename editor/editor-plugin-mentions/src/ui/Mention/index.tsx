import React, { useEffect, useState } from 'react';

import { MentionWithProfileCard } from '@atlaskit/editor-common/mention';
import { type ProfilecardProvider } from '@atlaskit/editor-common/src/provider-factory/profile-card-provider';
import type { MentionEventHandlers } from '@atlaskit/editor-common/ui';
import { browser } from '@atlaskit/editor-common/utils';
import { ResourcedMention } from '@atlaskit/mention/element';
import type { MentionProvider } from '@atlaskit/mention/resource';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

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

const Mention = (props: MentionProps) => {
  const {
    accessLevel,
    eventHandlers,
    id,
    text,
    localId,
    mentionProvider,
    profilecardProvider: profilecardProviderPromise,
  } = props;

  const [profilecardProvider, setProfilecardProvider] =
    useState<ProfilecardProvider | null>(null);

  // Resolve the profilecard provider
  useEffect(() => {
    if (profilecardProviderPromise) {
      profilecardProviderPromise
        .then(profilecardProvider => {
          setProfilecardProvider(profilecardProvider);
        })
        .catch(() => {
          setProfilecardProvider(null);
        });
    } else {
      setProfilecardProvider(null);
    }
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

  if (
    getBooleanFF('platform.editor.mentions-in-editor-popup-on-click') &&
    profilecardProvider
  ) {
    return (
      <MentionWithProfileCard
        id={id}
        text={text}
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
        text={text}
        accessLevel={accessLevel}
        mentionProvider={mentionProvider}
        localId={localId}
        {...actionHandlers}
      />
    );
  }
};

Mention.displayName = 'Mention';

export default Mention;
