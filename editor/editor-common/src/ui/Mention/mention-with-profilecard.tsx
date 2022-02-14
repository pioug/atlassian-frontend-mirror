import React, { useMemo } from 'react';

import { MentionProvider, ResourcedMention } from '@atlaskit/mention';
import { ProfileCardTrigger } from '@atlaskit/profilecard';

import { ProfilecardProvider } from '../../provider-factory/profile-card-provider';
import { MentionEventHandler } from '../EventHandlers';

export interface Props {
  id: string;
  text: string;
  accessLevel?: string;
  mentionProvider?: Promise<MentionProvider>;
  profilecardProvider: ProfilecardProvider;
  onClick?: MentionEventHandler;
  onMouseEnter?: MentionEventHandler;
  onMouseLeave?: MentionEventHandler;
}

export default function MentionWithProfileCard({
  id,
  text,
  accessLevel,
  mentionProvider,
  profilecardProvider,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: Props) {
  const { cloudId, resourceClient } = profilecardProvider;

  const actions = useMemo(
    () => profilecardProvider.getActions(id, text, accessLevel),
    [accessLevel, id, profilecardProvider, text],
  );

  return (
    <ProfileCardTrigger
      cloudId={cloudId}
      userId={id}
      resourceClient={resourceClient}
      actions={actions}
      trigger="click"
      position="bottom-end"
    >
      <ResourcedMention
        id={id}
        text={text}
        accessLevel={accessLevel}
        mentionProvider={mentionProvider}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    </ProfileCardTrigger>
  );
}
