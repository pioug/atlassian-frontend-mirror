import React, { useMemo } from 'react';

import type { MentionProvider } from '@atlaskit/mention';
import { ResourcedMention } from '@atlaskit/mention';
import ProfileCardTrigger from '@atlaskit/profilecard/user';

import type { ProfilecardProvider } from '../../provider-factory/profile-card-provider';
import type { MentionEventHandler } from '../EventHandlers';

export interface Props {
	autoFocus?: boolean;
	id: string;
	text: string;
	accessLevel?: string;
	mentionProvider?: Promise<MentionProvider>;
	profilecardProvider: ProfilecardProvider;
	onClick?: MentionEventHandler;
	onMouseEnter?: MentionEventHandler;
	onMouseLeave?: MentionEventHandler;
	localId?: string;
	ssrPlaceholderId?: string;
}

export default function MentionWithProfileCard({
	autoFocus,
	id,
	text,
	accessLevel,
	mentionProvider,
	profilecardProvider,
	onClick,
	onMouseEnter,
	onMouseLeave,
	localId,
	ssrPlaceholderId,
}: Props) {
	const { cloudId, resourceClient } = profilecardProvider;

	const actions = useMemo(
		() => profilecardProvider.getActions(id, text, accessLevel),
		[accessLevel, id, profilecardProvider, text],
	);

	return (
		<ProfileCardTrigger
			autoFocus={autoFocus}
			cloudId={cloudId}
			userId={id}
			resourceClient={resourceClient}
			actions={actions}
			trigger="click"
			position="bottom-end"
			testId="mention-with-profilecard-trigger"
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			ariaLabel={text.replace(/^@/, '')}
			ssrPlaceholderId={ssrPlaceholderId}
		>
			<ResourcedMention
				id={id}
				text={text}
				accessLevel={accessLevel}
				localId={localId}
				mentionProvider={mentionProvider}
				onClick={onClick}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				ssrPlaceholderId={ssrPlaceholderId}
			/>
		</ProfileCardTrigger>
	);
}
