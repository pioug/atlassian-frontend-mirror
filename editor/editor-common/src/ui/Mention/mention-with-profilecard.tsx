import React, { useMemo } from 'react';

import Loadable from 'react-loadable';

import type { MentionUserType } from '@atlaskit/adf-schema';
import type { MentionProvider } from '@atlaskit/mention';
import { ResourcedMention } from '@atlaskit/mention';
import { fg } from '@atlaskit/platform-feature-flags';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- TODO: migrate to @atlaskit/primitives/compiled
import Anchor from '@atlaskit/primitives/anchor';
import ProfileCardTrigger from '@atlaskit/profilecard/user';
import { navigateToTeamsApp } from '@atlaskit/teams-app-config/navigation';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { ProfilecardProvider } from '../../provider-factory/profile-card-provider';
import type { MentionEventHandler } from '../EventHandlers';

// Lazy-loaded so the agent profile card chunk (and its `@atlaskit/rovo-agent-components`
// dependency) stays off the critical path — it is only fetched when an agent mention
// (`userType === 'APP'`) actually renders, never for person mentions.
// Uses react-loadable to match editor-common's code-splitting factory (see src/icons/index.ts).
const AgentProfileCardTrigger: React.ComponentType<
	React.ComponentProps<
		(typeof import('@atlaskit/profilecard/agent-profile-card-trigger'))['AgentProfileCardTrigger']
	>
> &
	Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_profilecard/agent-profile-card-trigger" */
			'@atlaskit/profilecard/agent-profile-card-trigger'
		).then((mod) => mod.AgentProfileCardTrigger),
	loading: () => null,
});

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
	userType?: MentionUserType;
}

/**
 * Renders a mention chip wrapped in the appropriate profile card trigger.
 * 1. Agent mentions (`userType === 'APP'`, behind `rovo_chat_agent_selection`) open the Rovo agent profile card on click.
 * 2. Otherwise renders the person profile card (either via the provider's `renderUserMentionCard`/link fallback or the default user `ProfileCardTrigger`).
 */
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
	userType,
}: Props): React.JSX.Element {
	const { cloudId, renderUserMentionCard, resourceClient } = profilecardProvider;

	const actions = useMemo(
		() => profilecardProvider.getActions(id, text, accessLevel),
		[accessLevel, id, profilecardProvider, text],
	);

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

	// Agent mentions (userType 'APP') open the Rovo agent profile card on click.
	if (userType === 'APP' && cloudId && fg('rovo_chat_agent_selection')) {
		return (
			<AgentProfileCardTrigger
				agentId={id}
				cloudId={cloudId}
				resourceClient={resourceClient}
				trigger="click"
			>
				{mention}
			</AgentProfileCardTrigger>
		);
	}

	if (fg('people-teams_migrate-user-profile-card')) {
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
			{mention}
		</ProfileCardTrigger>
	);
}
