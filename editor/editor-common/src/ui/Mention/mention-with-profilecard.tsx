import React, { useMemo } from 'react';

import type { MentionProvider } from '@atlaskit/mention';
import { ResourcedMention } from '@atlaskit/mention';
import ProfileCardTrigger from '@atlaskit/profilecard/user';

import type { ProfilecardProvider } from '../../provider-factory/profile-card-provider';
import type { MentionEventHandler } from '../EventHandlers';

export interface Props {
	id: string;
	text: string;
	accessLevel?: string;
	mentionProvider?: Promise<MentionProvider>;
	profilecardProvider: ProfilecardProvider;
	onClick?: MentionEventHandler;
	onMouseEnter?: MentionEventHandler;
	onMouseLeave?: MentionEventHandler;
	localId?: string;
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
	localId,
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
			testId="mention-with-profilecard-trigger"
			ariaLabel={text.replace(/^@/, '')}
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
			/>
		</ProfileCardTrigger>
	);
}
