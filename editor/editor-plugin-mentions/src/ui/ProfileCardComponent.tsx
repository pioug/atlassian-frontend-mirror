/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useMemo, useState } from 'react';

import { bind } from 'bind-event-listener';
import Loadable from 'react-loadable';

import type { MentionAttributes } from '@atlaskit/adf-schema/mention';
import type { DocNode } from '@atlaskit/adf-schema/doc';
import { cssMap, jsx } from '@atlaskit/css';
import type { ProfilecardProvider } from '@atlaskit/editor-common/provider-factory';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import type { Placement } from '@atlaskit/popper/main';
import type {
	ProfileCardClientData,
	TeamCentralReportingLinesData,
} from '@atlaskit/profilecard/types';
import { ProfileCardLazy } from '@atlaskit/profilecard/lazy-profile-card';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';
import { token } from '@atlaskit/tokens';

import { Popup } from './PopperWrapper';

// eslint-disable-next-line require-unicode-regexp
const LEADING_AT_SIGN_RE = /^@/;

const AgentProfileCardResourcedLazy = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-plugin-mentions-agent-profile-card-resourced" */
			'@atlaskit/profilecard/agent-profile-card-resourced'
		).then(({ AgentProfileCardResourced }) => AgentProfileCardResourced),
	loading: () => null,
});

const styles = cssMap({
	loadingStyles: {
		boxShadow: token('elevation.shadow.overlay'),
		borderRadius: token('radius.small'),
	},
});

interface ProfileCardStateProps {
	id: string | undefined;
	provider: ProfilecardProvider | undefined;
}

type WrapperProps = { children: React.ReactNode; isLoading: boolean };
const LoadingWrapper = ({ children, isLoading }: WrapperProps) =>
	isLoading ? <div css={styles.loadingStyles}>{children}</div> : children;

export const isAgentMentionType = (userType: unknown): boolean =>
	userType === 'APP' || userType === 'AGENT';

export const useProfileCardState = ({
	id,
	provider,
}: ProfileCardStateProps): {
	data: ProfileCardClientData | undefined;
	hasError: boolean;
	isLoading: boolean;
	reportingLinesData: TeamCentralReportingLinesData | undefined;
	shouldShowGiveKudos: boolean;
	teamCentralBaseUrl: string | undefined;
} => {
	const [data, setData] = useState<ProfileCardClientData | undefined>();
	const [reportingLinesData, setReportingLinesData] = useState<
		TeamCentralReportingLinesData | undefined
	>(undefined);
	const [shouldShowGiveKudos, setShouldShowGiveKudos] = useState(false);
	const [teamCentralBaseUrl, setTeamCentralBaseUrl] = useState<string | undefined>(undefined);

	const [isLoading, setIsLoading] = useState(false);
	const [hasError, setHasError] = useState<boolean>(false);

	// From: packages/people-and-teams/profilecard/src/components/User/ProfileCardTrigger.tsx
	useEffect(() => {
		const fetchData = async () => {
			if (!id || !provider) {
				return;
			}
			setIsLoading(true);
			try {
				const [data, reportingLines, shouldGiveKudos, teamCentralBaseUrl] = await Promise.all([
					provider?.resourceClient.getProfile(provider?.cloudId || '', id, () => {}),
					provider?.resourceClient.getReportingLines(id),
					provider?.resourceClient.shouldShowGiveKudos(),
					provider?.resourceClient.getTeamCentralBaseUrl({
						withOrgContext: true,
						withSiteContext: true,
					}),
				]);
				setData(data);
				setReportingLinesData(reportingLines);
				setShouldShowGiveKudos(shouldGiveKudos ?? false);
				setTeamCentralBaseUrl(teamCentralBaseUrl);
				setHasError(false);
			} catch {
				setHasError(true);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [id, provider]);
	return {
		data,
		reportingLinesData,
		shouldShowGiveKudos,
		teamCentralBaseUrl,
		isLoading,
		hasError,
	};
};

/**
 * Renders the profile card popup for an editor mention node.
 */
export function ProfileCardComponent({
	profilecardProvider,
	activeMention,
	dom,
	closeComponent,
	onAgentMentionChatClick,
	placement,
	offset,
	disableFocusTrap,
	hideActions,
}: {
	activeMention: { attrs: MentionAttributes };
	closeComponent: () => void;
	disableFocusTrap?: boolean;
	dom: HTMLElement;
	hideActions?: boolean;
	offset?: [number, number];
	onAgentMentionChatClick?: (agentId: string, agentMentionContext?: DocNode) => void;
	placement?: Placement;
	profilecardProvider?: Promise<ProfilecardProvider> | undefined;
}): JSX.Element {
	const [provider, setProvider] = useState<ProfilecardProvider | undefined>(undefined);
	useEffect(() => {
		profilecardProvider?.then((p) => {
			setProvider(p);
		});
	}, [profilecardProvider]);

	const { id, text, accessLevel, userType } = (activeMention.attrs as MentionAttributes) ?? {};

	useEffect(() => {
		return bind(window, {
			type: 'keydown',
			listener: (e) => {
				if (e.key === 'Escape') {
					closeComponent();
				}
			},
		});
	});

	if (
		!expVal('platform_editor_agent_mentions', 'isEnabled', false) &&
		!fg('platform_editor_agent_card_fixes')
	) {
		return (
			<Popup
				referenceElement={dom}
				placement={placement}
				offset={offset}
				disableFocusTrap={disableFocusTrap}
			>
				<UserProfileCardContent
					accessLevel={accessLevel}
					id={id}
					provider={provider}
					text={text}
					hideActions={hideActions}
				/>
			</Popup>
		);
	}

	const isAgentMention = isAgentMentionType(userType);

	return (
		<Popup
			referenceElement={dom}
			placement={placement}
			offset={offset}
			disableFocusTrap={disableFocusTrap}
		>
			{isAgentMention && provider && id ? (
				<AgentProfileCardContent
					accountId={id}
					provider={provider}
					hideActions={hideActions}
					text={
						expVal('platform_editor_reduced_agent_profile_cards', 'isEnabled', false)
							? text
							: undefined
					}
					onChatClick={
						onAgentMentionChatClick && fg('platform_editor_agent_mentions_drop_one_fixes')
							? (event: React.MouseEvent, agentStudioId?: string) => {
									// agentMentionContext is already captured in the onAgentMentionChatClick
									// closure built by profileCardRenderer at chip-click time via doc.descendants()
									onAgentMentionChatClick(agentStudioId ?? id);
									// Dismiss the profile card once the Rovo chat panel opens (EDITOR-8257).
									if (fg('platform_editor_agent_card_close_on_chat')) {
										closeComponent();
									}
								}
							: undefined
					}
				/>
			) : (
				<UserProfileCardContent
					accessLevel={accessLevel}
					id={id}
					provider={provider}
					text={text}
					hideActions={hideActions}
				/>
			)}
		</Popup>
	);
}

const UserProfileCardContent = ({
	accessLevel,
	id,
	provider,
	text,
	hideActions,
}: {
	accessLevel: MentionAttributes['accessLevel'];
	hideActions?: boolean;
	id: MentionAttributes['id'];
	provider: ProfilecardProvider | undefined;
	text: MentionAttributes['text'];
}): JSX.Element => {
	const actions = useMemo(
		() => (hideActions ? [] : provider?.getActions(id, text ?? '', accessLevel)),
		[hideActions, accessLevel, id, provider, text],
	);

	const { data, reportingLinesData, shouldShowGiveKudos, teamCentralBaseUrl, isLoading, hasError } =
		useProfileCardState({ id, provider });

	return (
		<LoadingWrapper isLoading={isLoading}>
			<ProfileCardLazy
				avatarUrl={data?.avatarUrl}
				accountType={data?.accountType}
				status={data?.status}
				statusModifiedDate={data?.statusModifiedDate}
				timestring={data?.timestring}
				isCurrentUser={data?.isCurrentUser}
				isBot={data?.isBot}
				fullName={data?.fullName}
				userId={id}
				cloudId={provider?.cloudId}
				actions={actions}
				isLoading={isLoading}
				location={data?.location}
				companyName={data?.companyName}
				customLozenges={data?.customLozenges}
				nickname={data?.nickname}
				email={data?.email}
				hasError={hasError}
				reportingLines={reportingLinesData}
				isKudosEnabled={shouldShowGiveKudos}
				teamCentralBaseUrl={teamCentralBaseUrl}
				isRenderedInPortal={expValEquals(
					'editor_a11y_7152_profile_card_tab_order',
					'isEnabled',
					true,
				)}
			/>
		</LoadingWrapper>
	);
};

const AgentProfileCardContent = ({
	accountId,
	provider,
	text,
	onChatClick,
	hideActions,
}: {
	accountId: MentionAttributes['id'];
	hideActions?: boolean;
	onChatClick?: (event: React.MouseEvent, agentStudioId?: string) => void;
	provider: ProfilecardProvider;
	text?: MentionAttributes['text'];
}): JSX.Element => {
	const agentName = (text ?? '').replace(LEADING_AT_SIGN_RE, '');
	return expVal('platform_editor_reduced_agent_profile_cards', 'isEnabled', false) ? (
		<AgentProfileCardResourcedLazy
			accountId={accountId}
			cloudId={provider.cloudId}
			resourceClient={provider.resourceClient}
			agentName={agentName}
			onChatClick={onChatClick}
			hideAgentActions={hideActions}
			hideConversationStarters={hideActions}
			hideStarButton={hideActions}
			hideAiDisclaimer={hideActions}
			showCreatorNameWithoutLink={hideActions}
		/>
	) : (
		<AgentProfileCardResourcedLazy
			accountId={accountId}
			cloudId={provider.cloudId}
			resourceClient={provider.resourceClient}
			onChatClick={onChatClick}
			hideAgentActions={hideActions}
			hideConversationStarters={hideActions}
			hideStarButton={hideActions}
			hideAiDisclaimer={hideActions}
			showCreatorNameWithoutLink={hideActions}
		/>
	);
};
