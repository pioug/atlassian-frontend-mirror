import React, { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';

import { IntlProvider } from 'react-intl';

import Button from '@atlaskit/button/new';
import Code from '@atlaskit/code/code';
import { cssMap } from '@atlaskit/css';
import type { ProfilecardProvider } from '@atlaskit/editor-common/provider-factory';
import type { EditorAppearance } from '@atlaskit/editor-common/types';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { EditorContext } from '@atlaskit/editor-core/editor-context';
import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { Popper } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { Box, Inline, Text } from '@atlaskit/primitives/compiled';
import type { ProfileCardClientData } from '@atlaskit/profilecard/types';
import { token } from '@atlaskit/tokens';
import { simpleMockProfilecardClient } from '@atlaskit/util-data-test/get-mock-profilecard-client';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { UserProfileCard } from '@atlassian/user-profile-card/card';

import enMessages from '../src/i18n/en';

// `simpleMockProfilecardClient()` returns the structural `ProfileClient` interface
// that the legacy `<Profilecard>` consumes, but `ProfilecardProvider.resourceClient`
// is typed as the concrete `ProfileCardClient` class. They are interface-compatible
// for our purposes (we only call `getProfile` on it), so cast through the provider
// type to keep the rest of the example strictly typed.
const MockProfileClient = simpleMockProfilecardClient() as ProfilecardProvider['resourceClient'];

// Shape of the raw mock entry returned by `simpleMockProfilecardClient.getProfile`
// (defined in `@atlaskit/util-data-test/profilecard/profilecard-data`). The mock
// returns the underlying entry as-is rather than the canonical
// `ProfileCardClientData`, so we type it locally for safe field access.
type MockProfileEntry = ProfileCardClientData & {
	Presence?: { state?: string };
	remoteTimeString?: string;
	remoteWeekdayString?: string;
	User?: {
		avatarUrl?: string;
		companyName?: string;
		email?: string;
		fullName?: string;
		location?: string;
		meta?: string;
		nickname?: string;
	};
};

type CardMode = 'linkFallback' | 'customCardInline' | 'customCardPopup' | 'profileCard';

const styles = cssMap({
	toolbar: {
		paddingTop: token('space.150'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.150'),
		borderBlockEndWidth: token('border.width'),
		borderBlockEndStyle: 'solid',
		borderBlockEndColor: token('color.border'),
	},
	toolbarHint: {
		marginBlockStart: token('space.100'),
		color: token('color.text.subtlest'),
	},
	customCard: {
		width: '400px',
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
		backgroundColor: token('color.background.accent.purple.subtlest'),
		borderRadius: token('radius.medium'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border.accent.purple'),
	},
	customCardTitle: {
		font: token('font.heading.small'),
		color: token('color.text'),
		marginBlockEnd: token('space.100'),
	},
	customCardBody: {
		font: token('font.body'),
		color: token('color.text.subtle'),
	},
});

const MOCK_CLOUD_ID = 'DUMMY-CLOUDID';

// `simpleMockProfilecardClient.getProfile` indexes its data via
// `parseInt(userId, 10)` into `profilecardData` from `@atlaskit/util-data-test`,
// so we use the indices of known-good entries here. Picking ids that resolve
// against the mock means the profile-card mode shows real data instead of the
// "no profile available" empty state.
const KRAMER_ID = '0';
const SCHWARTZ_ID = '1';
const NICHOLE_ID = '2';

const userMention = (id: string, name: string) => ({
	type: 'mention',
	attrs: {
		id,
		text: `@${name}`,
		accessLevel: 'CONTAINER',
	},
});

const text = (value: string) => ({ type: 'text', text: value });

const defaultValue = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				text('Try clicking different mentions: '),
				userMention(KRAMER_ID, 'Kramer Hatfield'),
				text(', '),
				userMention(SCHWARTZ_ID, 'Schwartz Mclaughlin'),
				text(', '),
				userMention(NICHOLE_ID, 'Nichole Walter'),
				text('.'),
			],
		},
		{
			type: 'paragraph',
			content: [
				text(
					'Team mentions render as a team name plus member mentions, so each user inside is independently clickable: ',
				),
				{
					type: 'text',
					text: 'The Cool Cats',
					marks: [{ type: 'link', attrs: { href: '#the-cool-cats' } }],
				},
				text(' ('),
				userMention(KRAMER_ID, 'Kramer Hatfield'),
				text(' '),
				userMention(SCHWARTZ_ID, 'Schwartz Mclaughlin'),
				text(' '),
				userMention(NICHOLE_ID, 'Nichole Walter'),
				text(').'),
			],
		},
	],
};

/**
 * Wraps `UserProfileCard` and asynchronously loads richer profile data from
 * the same mock profilecard client the legacy popup uses, so the card shows
 * realistic data (avatar, job title, location, presence) instead of static
 * placeholders.
 */
function MockedUserProfileCard({
	userId,
	cloudId,
	fallbackName,
}: {
	cloudId: string;
	fallbackName: string;
	userId: string;
}): React.JSX.Element {
	const [profile, setProfile] = useState<MockProfileEntry | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		setIsLoading(true);
		MockProfileClient.getProfile(cloudId, userId)
			.then((data) => {
				if (cancelled) {
					return;
				}
				setProfile(data as MockProfileEntry);
				setIsLoading(false);
			})
			.catch(() => {
				if (cancelled) {
					return;
				}
				setProfile(null);
				setIsLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [userId, cloudId]);

	const user = profile?.User;
	const presence = profile?.Presence;

	return (
		<UserProfileCard
			cloudId={cloudId}
			isLoading={isLoading}
			profileData={{
				accountId: userId,
				name: user?.fullName ?? fallbackName,
				avatarUrl: user?.avatarUrl ?? null,
				jobTitle: user?.meta ?? null,
				department: user?.companyName ?? null,
				location: user?.location ?? null,
				email: user?.email ?? null,
				localTime: profile?.remoteTimeString
					? `${profile.remoteWeekdayString ?? ''} ${profile.remoteTimeString}`.trim()
					: null,
				organization: presence?.state ?? null,
			}}
		/>
	);
}

/**
 * Anchors `children` against `referenceElement` using `@atlaskit/portal` and
 * `@atlaskit/popper`, so the card floats above the document instead of pushing
 * surrounding content down. This mirrors the approach used by
 * `UserProfileCardForMention` (`@atlassian/user-profile-card/mention`) - the
 * editor never wraps the consumer's render output in a popup, so the consumer
 * is responsible for positioning. The parent owns the open/close lifecycle by
 * mounting/unmounting this component.
 */
function PortalPopupCard({
	children,
	referenceElement,
}: {
	children: ReactNode;
	referenceElement?: HTMLElement;
}): React.JSX.Element {
	if (!referenceElement) {
		return <>{children}</>;
	}
	return (
		<Portal zIndex={500}>
			<Popper referenceElement={referenceElement} placement="bottom-start">
				{({ ref, style }) => (
					<div
						ref={ref}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- positioning controlled by popper
						style={style}
					>
						{children}
					</div>
				)}
			</Popper>
		</Portal>
	);
}

/**
 * A simple custom card component that demonstrates the `renderUserMentionCard` extension point.
 */
function CustomMentionCard({ name }: { name: string }): React.JSX.Element {
	return (
		<Box xcss={styles.customCard}>
			<Box xcss={styles.customCardTitle}>Custom mention card</Box>
			<Box xcss={styles.customCardBody}>
				<Text>
					This is a custom card rendered by the consumer's implementation of{' '}
					<Code>renderUserMentionCard</Code>. You can pass in any React component here and give it
					data like the mention's display name {name}, user ID, or anything else you can get from
					the editor's <Code>referenceElement</Code> or your own data sources.
				</Text>
			</Box>
		</Box>
	);
}

function ToolbarButton({
	active,
	onClick,
	children,
}: {
	active: boolean;
	children: ReactNode;
	onClick: () => void;
}): React.JSX.Element {
	return (
		<Button onClick={onClick} isSelected={active}>
			{children}
		</Button>
	);
}

function MentionsProfileCardOptionsExample(): React.JSX.Element {
	const appearance: EditorAppearance = 'full-page';
	const [mode, setMode] = useState<CardMode>('linkFallback');

	// The editor's mention nodeview captures the `profilecardProvider` Promise
	// reference once at mount and reads `provider.renderUserMentionCard` on every
	// click. To support live mode switching, we resolve the provider Promise once
	// and then mutate the same provider object whenever `mode` changes - that way
	// the editor's existing reference always sees the current behavior.
	const providerRef = useRef<ProfilecardProvider>({
		cloudId: MOCK_CLOUD_ID,
		resourceClient: MockProfileClient,
		getActions: (_id, _text, _accessLevel) => [],
	});

	const profilecardProvider = useMemo(() => Promise.resolve(providerRef.current), []);

	useEffect(() => {
		const provider = providerRef.current;
		if (mode === 'linkFallback') {
			// Removing `renderUserMentionCard` lets the editor fall back to its
			// default link behavior (`navigateToTeamsApp`).
			delete provider.renderUserMentionCard;
			return;
		}
		if (mode === 'customCardInline') {
			// Renders the card inline inside the mention DOM. This will push
			// content below it down - intentionally shown so devs can see what
			// the editor's default mounting behavior looks like and why most
			// consumers should anchor their card via a portal/popper instead.
			provider.renderUserMentionCard = ({ referenceElement }) => {
				const displayName = referenceElement?.textContent?.replace(/^@/u, '').trim() || 'this user';
				return <CustomMentionCard name={displayName} />;
			};
			return;
		}
		if (mode === 'customCardPopup') {
			provider.renderUserMentionCard = ({ referenceElement }) => {
				const displayName = referenceElement?.textContent?.replace(/^@/u, '').trim() || 'this user';
				return (
					<PortalPopupCard referenceElement={referenceElement}>
						<CustomMentionCard name={displayName} />
					</PortalPopupCard>
				);
			};
			return;
		}
		provider.renderUserMentionCard = ({ userId, cloudId, referenceElement }) => {
			const fallbackName =
				referenceElement?.textContent?.replace(/^@/u, '').trim() || 'Unknown user';
			return (
				<PortalPopupCard referenceElement={referenceElement}>
					<MockedUserProfileCard userId={userId} cloudId={cloudId} fallbackName={fallbackName} />
				</PortalPopupCard>
			);
		};
	}, [mode]);

	const universalPreset = useUniversalPreset({
		props: {
			appearance,
			mentionProvider: Promise.resolve(mentionResourceProvider),
			mention: {
				profilecardProvider,
			},
			allowAnalyticsGASV3: true,
			allowTextColor: true,
			allowRule: true,
		},
	});

	const { preset } = usePreset(() => universalPreset, [universalPreset]);

	return (
		<>
			<Box xcss={styles.toolbar}>
				<Inline space="space.150" alignBlock="center">
					<strong>Mention click behavior:</strong>
					<ToolbarButton active={mode === 'linkFallback'} onClick={() => setMode('linkFallback')}>
						Default (link fallback)
					</ToolbarButton>
					<ToolbarButton
						active={mode === 'customCardInline'}
						onClick={() => setMode('customCardInline')}
					>
						Custom component (inline)
					</ToolbarButton>
					<ToolbarButton
						active={mode === 'customCardPopup'}
						onClick={() => setMode('customCardPopup')}
					>
						Custom component (popup)
					</ToolbarButton>
					<ToolbarButton active={mode === 'profileCard'} onClick={() => setMode('profileCard')}>
						Custom card - profile card
					</ToolbarButton>
				</Inline>
				<Box xcss={styles.toolbarHint}>
					Click the existing mention in the editor below (or type <Code>@</Code> to insert another)
					to see the configured behavior.
				</Box>
			</Box>
			<IntlProvider locale="en" messages={enMessages}>
				<ComposableEditor
					appearance={appearance}
					preset={preset}
					defaultValue={defaultValue}
					mentionProvider={Promise.resolve(mentionResourceProvider)}
				/>
			</IntlProvider>
		</>
	);
}

/**
 * Example: profile card options for user mentions in the editor.
 *
 * Demonstrates the three behaviors the editor supports when a user clicks an `@user` mention
 * (assumes the `people-teams_migrate-user-profile-card` gate is on):
 *
 * - **Default (link fallback):** clicking the mention navigates to the user's profile in the
 *   Teams app via `navigateToTeamsApp` (default behavior when no `renderUserMentionCard` is
 *   provided).
 * - **Custom card:** the consumer passes a `renderUserMentionCard` function on the
 *   `profilecardProvider`. The editor renders whatever the consumer returns - here a small
 *   demo card.
 * - **Custom card - profile card:** same extension point, but rendering the real
 *   `UserProfileCard` from `@atlassian/user-profile-card/card`.
 */
export default function MentionsProfileCardOptions(): React.JSX.Element {
	return (
		<EditorContext>
			<MentionsProfileCardOptionsExample />
		</EditorContext>
	);
}
