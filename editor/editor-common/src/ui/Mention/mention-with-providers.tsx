import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import type { UserType as MentionUserType } from '@atlaskit/adf-schema/mention';
import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import { ELEMENTS_CHANNEL } from '@atlaskit/mention/constants';
import ResourcedMention from '@atlaskit/mention/resourced-mention';
import type { MentionNodeData, MentionProvider } from '@atlaskit/mention/types';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { ProfilecardProvider } from '../../provider-factory/profile-card-provider';
import type { MentionEventHandlers } from '../EventHandlers';
import type {
	MentionNodeDataIdentifier,
	MentionNodeDataProvider,
} from './mention-node-data-provider';
import ResourcedMentionWithProfilecard from './mention-with-profilecard';

export interface Props {
	accessLevel?: string;
	disabledTooltip?: string;
	eventHandlers?: MentionEventHandlers;
	id: string;
	isDisabled?: boolean;
	localId?: string;
	mentionNodeDataProvider?: MentionNodeDataProvider;
	mentionProvider?: Promise<MentionProvider>;
	profilecardProvider?: Promise<ProfilecardProvider>;
	text: string;
	userType?: MentionUserType;
}

export interface MentionWithProvidersProps extends Props {
	mentionNodeData?: MentionNodeData;
	renderAvatarSlot?: boolean;
}

export interface State {
	profilecardProvider: ProfilecardProvider | null;
}

const GENERIC_USER_IDS = ['HipChat', 'all', 'here'];

const useAvatarFailureReporter = () => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const createEventRef = useRef(createAnalyticsEvent);
	createEventRef.current = createAnalyticsEvent;
	return useCallback((reason: 'provider_failed' | 'missing_avatar_url' | 'missing_provider') => {
		if (fg('platform_editor_mention_avatar_observability')) {
			createEventRef
				.current({
					action: 'failed',
					actionSubject: 'mentionAvatar',
					eventType: 'operational',
					attributes: { componentName: 'mention', reason, surface: 'renderer' },
				})
				.fire(ELEMENTS_CHANNEL);
		}
	}, []);
};

export const MissingMentionAvatarProvider = ({ mentionKey }: { mentionKey: string }): null => {
	const reportFailure = useAvatarFailureReporter();
	const reportedKey = useRef<string>();
	useEffect(() => {
		if (reportedKey.current !== mentionKey) {
			reportedKey.current = mentionKey;
			reportFailure('missing_provider');
		}
	}, [mentionKey, reportFailure]);
	return null;
};

const useMentionNodeData = ({
	id,
	mentionNodeDataProvider,
	userType,
}: {
	id: string;
	mentionNodeDataProvider: MentionNodeDataProvider;
	userType?: MentionUserType;
}) => {
	const reportFailure = useAvatarFailureReporter();
	const reportedResolution = useRef<{
		mention: MentionNodeDataIdentifier;
		provider: MentionNodeDataProvider;
	}>();
	const mention = useMemo<MentionNodeDataIdentifier>(() => ({ id, userType }), [id, userType]);
	const mentionKey = `${userType ?? 'DEFAULT'}:${id}`;
	const synchronousData = useMemo(
		() => mentionNodeDataProvider.getMentionDataFromCache(mention),
		[mention, mentionNodeDataProvider],
	);
	const [state, setState] = useState<{
		data: MentionNodeData | undefined;
		key: string;
	}>(() => ({
		data: synchronousData,
		key: mentionKey,
	}));

	const data = state.key === mentionKey ? (state.data ?? synchronousData) : synchronousData;

	useEffect(() => {
		const reportResolution = (data?: MentionNodeData, error?: Error) => {
			if (!error && (!data || data.avatarUrl)) {
				return;
			}
			if (
				reportedResolution.current?.mention === mention &&
				reportedResolution.current.provider === mentionNodeDataProvider
			) {
				return;
			}
			reportedResolution.current = { mention, provider: mentionNodeDataProvider };
			if (error) {
				reportFailure('provider_failed');
			} else if (data && !data.avatarUrl) {
				reportFailure('missing_avatar_url');
			}
		};
		if (synchronousData) {
			reportResolution(synchronousData);
			return;
		}

		let isActive = true;
		mentionNodeDataProvider.getMentionData(mention, (payload) => {
			if (isActive) {
				reportResolution(payload.data, payload.error);
				if (payload.data) {
					setState({ data: payload.data, key: mentionKey });
				}
			}
		});

		return () => {
			isActive = false;
		};
	}, [mention, mentionKey, mentionNodeDataProvider, synchronousData, reportFailure]);

	return data;
};

export const MentionWithProviders: React.MemoExoticComponent<
	(props: MentionWithProvidersProps) => React.JSX.Element
> = React.memo(
	({
		accessLevel,
		disabledTooltip,
		eventHandlers,
		id,
		isDisabled,
		mentionNodeData,
		mentionProvider,
		profilecardProvider: profilecardProviderResolver,
		renderAvatarSlot = false,
		text,
		localId,
		userType,
	}: MentionWithProvidersProps): React.JSX.Element => {
		const [profilecardProvider, setProfilecardProvider] = useState<ProfilecardProvider | null>(
			null,
		);
		const [isRovoChat, setIsRovoChat] = useState(
			isExperimentEnabled('platform_editor_mention_rovo') && Boolean(mentionNodeData?.isRovoChat),
		);
		const mountedRef = useRef(true);

		useLayoutEffect(() => {
			mountedRef.current = true;
			return () => {
				mountedRef.current = false;
			};
		}, []);

		useLayoutEffect(() => {
			// We are not using async/await here to avoid having an intermediate Promise
			// introduced by the transpiler.
			// This will allow consumer to use a SynchronousPromise.resolve and avoid useless
			// rerendering
			profilecardProviderResolver
				?.then((result) => {
					if (mountedRef.current) {
						setProfilecardProvider(result);
					}
				})
				.catch(() => {
					if (mountedRef.current) {
						setProfilecardProvider(null);
					}
				});
		}, [profilecardProviderResolver]);

		useEffect(() => {
			if (mentionNodeData?.isRovoChat) {
				setIsRovoChat(isExperimentEnabled('platform_editor_mention_rovo'));
				return;
			}
			if (!isExperimentEnabled('platform_editor_mention_rovo') || !mentionProvider) {
				setIsRovoChat(false);
				return;
			}

			let isActive = true;
			const resolveRovoChatIdentity = async (): Promise<void> => {
				try {
					const provider = await mentionProvider;
					const identityAccountId = await provider.getRovoChatAgentIdentityAccountId?.();
					if (isActive) {
						setIsRovoChat(identityAccountId !== undefined && identityAccountId === id);
					}
				} catch {
					if (isActive) {
						setIsRovoChat(false);
					}
				}
			};

			void resolveRovoChatIdentity();

			return () => {
				isActive = false;
			};
		}, [id, mentionNodeData?.isRovoChat, mentionProvider]);

		const MentionComponent =
			profilecardProvider && profilecardProviderResolver && GENERIC_USER_IDS.indexOf(id) === -1
				? ResourcedMentionWithProfilecard
				: ResourcedMention;

		const ssrPlaceholderId = `mention-${id}`;

		// A disabled mention is non-interactive, so it bypasses the profile-card
		// wrapper and renders the disabled resourced mention directly.
		if (isDisabled) {
			return (
				<ResourcedMention
					id={id}
					text={text}
					accessLevel={accessLevel}
					localId={localId}
					mentionProvider={mentionProvider}
					appType={mentionNodeData?.appType}
					avatarUrl={mentionNodeData?.avatarUrl}
					isAvatarImagePreShaped={mentionNodeData?.isAvatarImagePreShaped}
					isDisabled
					disabledTooltip={disabledTooltip}
					onClick={eventHandlers?.onClick}
					onMouseEnter={eventHandlers?.onMouseEnter}
					onMouseLeave={eventHandlers?.onMouseLeave}
					renderAvatarSlot={renderAvatarSlot}
					ssrPlaceholderId={ssrPlaceholderId}
					isRovoChat={isRovoChat}
				/>
			);
		}

		return (
			<MentionComponent
				id={id}
				text={text}
				accessLevel={accessLevel}
				localId={localId}
				userType={userType}
				mentionProvider={mentionProvider}
				appType={mentionNodeData?.appType}
				avatarUrl={mentionNodeData?.avatarUrl}
				isAvatarImagePreShaped={mentionNodeData?.isAvatarImagePreShaped}
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				profilecardProvider={profilecardProvider!}
				onClick={eventHandlers?.onClick}
				onMouseEnter={eventHandlers?.onMouseEnter}
				onMouseLeave={eventHandlers?.onMouseLeave}
				renderAvatarSlot={renderAvatarSlot}
				ssrPlaceholderId={ssrPlaceholderId}
				isRovoChat={isRovoChat}
			/>
		);
	},
);

export const MentionWithAvatarProviders: React.MemoExoticComponent<
	(props: Props & { mentionNodeDataProvider: MentionNodeDataProvider }) => React.JSX.Element
> = React.memo(({ id, mentionNodeDataProvider, userType, ...props }): React.JSX.Element => {
	const mentionNodeData = useMentionNodeData({
		id,
		mentionNodeDataProvider,
		userType,
	});

	return (
		<MentionWithProviders
			// eslint-disable-next-line react/jsx-props-no-spreading -- The treatment adds only resolved avatar data to the existing mention props.
			{...props}
			id={id}
			mentionNodeData={mentionNodeData}
			renderAvatarSlot
			userType={userType}
		/>
	);
});
