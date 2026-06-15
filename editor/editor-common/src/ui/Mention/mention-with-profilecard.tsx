import React, { useMemo } from 'react';

import type { MentionProvider } from '@atlaskit/mention';
import { ResourcedMention } from '@atlaskit/mention';
import { fg } from '@atlaskit/platform-feature-flags';
import Anchor from '@atlaskit/primitives/anchor';
import ProfileCardTrigger from '@atlaskit/profilecard/user';
import { navigateToTeamsApp } from '@atlaskit/teams-app-config/navigation';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { ProfilecardProvider } from '../../provider-factory/profile-card-provider';
import type { MentionEventHandler } from '../EventHandlers';

// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const AT_PREFIX_REGEX = /^@/;

export interface Props {
	accessLevel?: string;
	autoFocus?: boolean;
	id: string;
	localId?: string;
	mentionProvider?: Promise<MentionProvider>;
	onClick?: MentionEventHandler;
	onMouseEnter?: MentionEventHandler;
	onMouseLeave?: MentionEventHandler;
	profilecardProvider: ProfilecardProvider;
	ssrPlaceholderId?: string;
	text: string;
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
}: Props): React.JSX.Element {
	const { cloudId, renderUserMentionCard, resourceClient } = profilecardProvider;

	const actions = useMemo(
		() => profilecardProvider.getActions(id, text, accessLevel),
		[accessLevel, id, profilecardProvider, text],
	);

	if (fg('people-teams_migrate-user-profile-card')) {
		const mention = (
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
		);

		if (renderUserMentionCard) {
			return <>{renderUserMentionCard({ userId: id, cloudId, children: mention })}</>;
		}

		const { href, target } = navigateToTeamsApp({
			type: 'USER',
			payload: { userId: id },
			cloudId,
		});

		return (
			<Anchor
				href={href}
				target={target}
				rel="noopener noreferrer"
				testId="mention-with-profilecard-link-fallback"
			>
				{mention}
			</Anchor>
		);
	}

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
			ariaLabel={text.replace(AT_PREFIX_REGEX, '')}
			ssrPlaceholderId={ssrPlaceholderId}
			isRenderedInPortal={expValEquals(
				'editor_a11y_7152_profile_card_tab_order',
				'isEnabled',
				true,
			)}
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
