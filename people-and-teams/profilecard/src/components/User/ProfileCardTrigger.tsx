import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useIntl } from 'react-intl-next';

import { GiveKudosLauncherLazy, KudosType } from '@atlaskit/give-kudos';
import { fg } from '@atlaskit/platform-feature-flags';
import Popup from '@atlaskit/popup';
import { type FireEventType, useAnalyticsEvents } from '@atlaskit/teams-app-internal-analytics';
import { layers } from '@atlaskit/theme/constants';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import filterActionsInner from '../../internal/filterActions';
import getLabelMessage from '../../internal/getLabelMessage';
import { CardWrapper } from '../../styled/UserTrigger';
import {
	type AgentActionsType,
	type Flag,
	type ProfileCardAction,
	type ProfileCardClientData,
	type ProfileCardErrorType,
	type ProfilecardProps,
	type ProfileCardTriggerProps,
	type ProfileClient,
	type TeamCentralReportingLinesData,
	type TriggerType,
} from '../../types';
import { PACKAGE_META_DATA } from '../../util/analytics';
import { DELAY_MS_HIDE, DELAY_MS_SHOW } from '../../util/config';
import { getPageTime } from '../../util/performance';
import { AgentProfileCardResourced } from '../Agent/AgentProfileCardResourced';

import { ProfileCardLazy } from './lazyProfileCard';
import UserLoadingState from './UserLoadingState';

function ProfileCardContent({
	profilecardProps,
	userId,
	cloudId,
	resourceClient,
	trigger,
	isAgent,
	profileCardAction,
	hasError,
	errorType,
	agentActions,
	isRenderedInPortal,
	addFlag,
	hideAgentMoreActions,
	hideAiDisclaimer,
}: {
	profilecardProps: ProfilecardProps;
	userId: string;
	cloudId: string;
	resourceClient: ProfileClient;
	viewingUserId?: string;
	trigger?: TriggerType;
	product?: string;
	isAgent: boolean;
	/**
	 * Indicates whether the profile card is rendered in a portal.
	 *
	 * If true, the profile card will auto-focus the name element when opened for better accessibility,
	 * keeping the user's focus in the tab trap.
	 */
	isRenderedInPortal?: boolean;
	profileCardAction: ProfileCardAction[];
	hasError?: boolean;
	errorType?: ProfileCardErrorType;
	agentActions?: AgentActionsType;
	addFlag?: (flag: Flag) => void;
	hideAgentMoreActions?: boolean;
	hideAiDisclaimer?: boolean;
}) {
	if (isAgent) {
		return (
			<AgentProfileCardResourced
				accountId={userId}
				cloudId={cloudId!}
				resourceClient={resourceClient}
				trigger={trigger}
				onChatClick={agentActions?.onChatClick}
				onConversationStartersClick={agentActions?.onConversationStartersClick}
				addFlag={addFlag}
				hideMoreActions={fg('jira_ai_profilecard_hide_agent_actions') && !!hideAgentMoreActions}
				hideConversationStarters={
					fg('jira_ai_hide_conversation_starters_profilecard') &&
					!!profilecardProps.hideAgentConversationStarters
				}
				hideAiDisclaimer={hideAiDisclaimer}
			/>
		);
	} else {
		const profileCard = (
			<Suspense fallback={null}>
				<ProfileCardLazy
					{...profilecardProps}
					isRenderedInPortal={isRenderedInPortal}
					actions={profileCardAction}
					hasError={hasError}
					errorType={errorType}
					withoutElevation
				/>
			</Suspense>
		);

		return profileCard;
	}
}
export default function ProfilecardTriggerNext({
	autoFocus,
	trigger = 'hover',
	userId,
	cloudId,
	resourceClient,
	actions = [],
	position = 'bottom-start',
	children,
	testId,
	addFlag,
	onReportingLinesClick,
	ariaLabel,
	ariaLabelledBy,
	prepopulatedData,
	disabledAriaAttributes,
	onVisibilityChange,
	offset,
	viewingUserId,
	product,
	agentActions,
	hideAgentMoreActions,
	hideAiDisclaimer,
	hideAgentConversationStarters,
	hideReportingLines,
	ariaHideProfileTrigger = false,
	isVisible: propsIsVisible,
	isRenderedInPortal,
	ssrPlaceholderId,
	showDelay: customShowDelay,
	hideDelay: customHideDelay,
}: ProfileCardTriggerProps): React.JSX.Element {
	const { formatMessage } = useIntl();

	const isMounted = useRef(false);

	const [visible, setVisible] = useState<boolean>(false);
	const showTimer = useRef<number>(0);
	const hideTimer = useRef<number>(0);

	const isExternalControl = propsIsVisible !== undefined && propsIsVisible !== visible;
	// Skip delay entirely for click triggers, or for externally controlled visibility
	// when the flashing fix is not enabled (preserving the original 0ms behavior).
	const shouldSkipDelay =
		trigger === 'click' ||
		(isExternalControl &&
			!fg('jira_ai_fix_agent_profile_card_flashing') &&
			fg('fix_profilecard_trigger_isvisible'));
	// When externally controlled with the flashing fix enabled, use a short debounce
	// to absorb rapid focus changes from dropdown options settling after async load.
	const REDUCED_DELAY_MS = 100;
	const shouldReduceDelay =
		isExternalControl && fg('jira_ai_fix_agent_profile_card_flashing');

	let showDelay = customShowDelay ?? DELAY_MS_SHOW;
	let hideDelay = customHideDelay ?? DELAY_MS_HIDE;
	if (shouldSkipDelay) {
		showDelay = 0;
		hideDelay = 0;
	} else if (shouldReduceDelay) {
		showDelay = REDUCED_DELAY_MS;
		hideDelay = REDUCED_DELAY_MS;
	}

	const [isLoading, setIsLoading] = useState<boolean | undefined>(undefined);
	const [hasError, setHasError] = useState<boolean>(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState<ProfileCardClientData | null>(null);
	const [reportingLinesData, setReportingLinesData] = useState<
		TeamCentralReportingLinesData | undefined
	>(undefined);
	const [shouldShowGiveKudos, setShouldShowGiveKudos] = useState(false);
	const [teamCentralBaseUrl, setTeamCentralBaseUrl] = useState<string | undefined>(undefined);
	const [kudosDrawerOpen, setKudosDrawerOpen] = useState(false);
	const [isTriggeredUsingKeyboard, setTriggeredUsingKeyboard] = useState(false);
	const triggerRef = useRef<HTMLElement | null>(null);
	const { fireEvent } = useAnalyticsEvents();

	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
			clearTimeout(showTimer.current);
			clearTimeout(hideTimer.current);
		};
	}, []);

	useEffect(() => {
		// Reset state when the userId changes
		setIsLoading(undefined);
		setHasError(false);
		setError(null);
		setData(null);
		setReportingLinesData(undefined);
		setShouldShowGiveKudos(false);
		setTeamCentralBaseUrl(undefined);
	}, [userId]);

	const fireAnalytics: FireEventType = useCallback(
		(eventKey, ...attributes) => {
			if (!isMounted.current) {
				return;
			}
			fireEvent(eventKey, ...attributes);
		},
		[fireEvent],
	);

	const hideProfilecard = useCallback(() => {
		clearTimeout(showTimer.current);
		clearTimeout(hideTimer.current);
		if (!isTriggeredUsingKeyboard) {
			hideTimer.current = window.setTimeout(() => {
				setVisible(false);
				onVisibilityChange && onVisibilityChange(false);
			}, hideDelay);
		}
	}, [hideDelay, isTriggeredUsingKeyboard, onVisibilityChange]);

	const handleKeyboardClose = useCallback(
		(event: React.KeyboardEvent) => {
			if (event.key && event.key !== 'Escape') {
				return;
			}
			if (triggerRef.current) {
				triggerRef.current.focus();
			}
			setTriggeredUsingKeyboard(false);
			setVisible(false);
			onVisibilityChange && onVisibilityChange(false);
		},
		[setTriggeredUsingKeyboard, setVisible, onVisibilityChange],
	);

	const handleClientSuccess = useCallback(
		(
			profileData: ProfileCardClientData,
			reportingLinesData: TeamCentralReportingLinesData,
			shouldShowGiveKudos: boolean,
			teamCentralBaseUrl?: string,
		) => {
			if (!isMounted.current) {
				return;
			}

			setIsLoading(false);
			setHasError(false);
			setData(profileData);
			setReportingLinesData(reportingLinesData);
			setTeamCentralBaseUrl(teamCentralBaseUrl);
			setShouldShowGiveKudos(shouldShowGiveKudos);
		},
		[setHasError, setIsLoading, setData, setReportingLinesData, setShouldShowGiveKudos],
	);

	const handleClientError = useCallback(
		(err: any) => {
			if (!isMounted.current) {
				return;
			}

			setIsLoading(false);
			setHasError(true);
			setError(err);
		},
		[setHasError, setIsLoading, setError],
	);

	const clientFetchProfile = useCallback(async () => {
		if (isLoading === true) {
			// don't fetch data when fetching is in process
			return;
		}

		setIsLoading(true);
		setHasError(false);
		setError(null);
		setData(null);

		try {
			const shouldHideReportingLines =
				fg('jira_ai_profilecard_hide_reportinglines') && hideReportingLines;

			const requests = Promise.all([
				resourceClient.getProfile(cloudId || '', userId, fireAnalytics),
				shouldHideReportingLines
					? Promise.resolve({ managers: [], reports: [] })
					: resourceClient.getReportingLines(userId),
				resourceClient.shouldShowGiveKudos(),
				resourceClient.getTeamCentralBaseUrl({
					withOrgContext: true,
					withSiteContext: true,
				}),
			]);

			const responses = await requests;
			handleClientSuccess(...responses);
		} catch (err) {
			handleClientError(err);
		}
	}, [
		cloudId,
		fireAnalytics,
		isLoading,
		resourceClient,
		userId,
		handleClientSuccess,
		handleClientError,
		hideReportingLines,
	]);

	const showProfilecard = useCallback(() => {
		clearTimeout(hideTimer.current);
		clearTimeout(showTimer.current);
		showTimer.current = window.setTimeout(() => {
			if (!visible) {
				void clientFetchProfile();
				setVisible(true);
				onVisibilityChange && onVisibilityChange(true);
			}
		}, showDelay);
	}, [showDelay, visible, clientFetchProfile, onVisibilityChange]);

	const onClick = useCallback(
		(event: React.MouseEvent) => {
			// If the user clicks on the trigger then we don't want that click event to
			// propagate out to parent containers. For example when clicking a mention
			// lozenge in an inline-edit.
			event.stopPropagation();

			showProfilecard();

			if (!visible) {
				fireAnalytics('ui.profilecard.triggered', {
					method: 'click',
					firedAt: Math.round(getPageTime()),
					...PACKAGE_META_DATA,
				});
			}
		},
		[fireAnalytics, showProfilecard, visible],
	);

	const onMouseEnter = useCallback(() => {
		showProfilecard();

		if (!visible) {
			fireAnalytics('ui.profilecard.triggered', {
				method: 'hover',
				firedAt: Math.round(getPageTime()),
				...PACKAGE_META_DATA,
			});
		}
	}, [fireAnalytics, showProfilecard, visible]);

	const onKeyPress = useCallback(
		(event: React.KeyboardEvent) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				setTriggeredUsingKeyboard(true);
				showProfilecard();
				if (!visible) {
					fireAnalytics('ui.profilecard.triggered', {
						method: 'click',
						firedAt: Math.round(getPageTime()),
						...PACKAGE_META_DATA,
					});
				}
			}
		},
		[fireAnalytics, showProfilecard, visible],
	);

	const onFocus = useCallback(() => {
		showProfilecard();
	}, [showProfilecard]);

	useEffect(() => {
		if (!fg('fix_profilecard_trigger_isvisible')) {
			return;
		}
		// If the prop isVisible is not defined, we don't want to do anything
		if (propsIsVisible === undefined) {
			return;
		}
		// If the prop isVisible is defined, we want to show or hide the profile card based on the value
		if (propsIsVisible) {
			showProfilecard();
		} else {
			hideProfilecard();
		}
	}, [hideProfilecard, propsIsVisible, showProfilecard]);

	const containerListeners = useMemo(
		() =>
			trigger === 'hover'
				? {
						onMouseEnter: onMouseEnter,
						onMouseLeave: hideProfilecard,
						onBlur: hideProfilecard,
						onKeyPress: onKeyPress,
					}
				: {
						onClick: onClick,
						onKeyPress: onKeyPress,
					},
		[hideProfilecard, onClick, onKeyPress, onMouseEnter, trigger],
	);

	const filterActions = useCallback((): ProfileCardAction[] => {
		return filterActionsInner(actions, data);
	}, [actions, data]);

	const openKudosDrawer = () => {
		hideProfilecard();
		setKudosDrawerOpen(true);
	};

	const closeKudosDrawer = () => {
		setKudosDrawerOpen(false);
	};

	const showLoading = isLoading === true || isLoading === undefined;
	const wrapperProps = useMemo(
		() =>
			trigger === 'hover'
				? {
						onMouseEnter: onMouseEnter,
						onMouseLeave: hideProfilecard,
						onFocus: onFocus,
					}
				: {},
		[hideProfilecard, onFocus, onMouseEnter, trigger],
	);
	const profilecardProps: ProfilecardProps = {
		userId: userId,
		fullName: prepopulatedData?.fullName,
		isCurrentUser: userId === viewingUserId,
		clientFetchProfile: clientFetchProfile,
		...data,
		reportingLines: reportingLinesData,
		onReportingLinesClick: onReportingLinesClick,
		isKudosEnabled: shouldShowGiveKudos,
		teamCentralBaseUrl: teamCentralBaseUrl,
		cloudId: cloudId,
		openKudosDrawer: openKudosDrawer,
		isTriggeredUsingKeyboard: isTriggeredUsingKeyboard,
		disabledAriaAttributes: disabledAriaAttributes,
		hideReportingLines: fg('jira_ai_profilecard_hide_reportinglines') && hideReportingLines,
		hideAgentConversationStarters:
			fg('jira_ai_hide_conversation_starters_profilecard') && hideAgentConversationStarters,
	};

	const ssrPlaceholderProp = ssrPlaceholderId
		? { 'data-ssr-placeholder-replace': ssrPlaceholderId }
		: {};

	return (
		<>
			<Popup
				isOpen={!!visible}
				onClose={(event: React.KeyboardEvent) => {
					hideProfilecard();
					handleKeyboardClose(event);
				}}
				placement={position}
				offset={offset ?? [0, 8]}
				content={() => (
					<div {...wrapperProps}>
						{showLoading ? (
							<LoadingView fireAnalytics={fireAnalytics} />
						) : (
							visible && (
								<ProfileCardContent
									profilecardProps={profilecardProps}
									isAgent={!!data?.isAgent}
									userId={userId}
									cloudId={cloudId!}
									resourceClient={resourceClient}
									viewingUserId={viewingUserId}
									trigger={trigger}
									product={product}
									profileCardAction={filterActions()}
									errorType={error}
									hasError={hasError}
									agentActions={agentActions}
									addFlag={addFlag}
									hideAgentMoreActions={hideAgentMoreActions}
									hideAiDisclaimer={hideAiDisclaimer}
									isRenderedInPortal={isRenderedInPortal}
								/>
							)
						)}
					</div>
				)}
				trigger={(triggerProps) => {
					const { ref: callbackRef, ...innerProps } = triggerProps;
					const ref = (element: HTMLElement | null) => {
						triggerRef.current = element;
						if (typeof callbackRef === 'function') {
							callbackRef(element);
						}
					};
					const { 'aria-expanded': _, 'aria-haspopup': __, ...restInnerProps } = innerProps;
					return (
						<span
							{...(disabledAriaAttributes ? restInnerProps : triggerProps)}
							{...containerListeners}
							ref={ref}
							data-testid={testId}
							{...(!ariaHideProfileTrigger && { 'aria-labelledby': ariaLabelledBy })}
							{...(disabledAriaAttributes
								? {}
								: {
										role: 'button',
										//  aria-hidden cannot contain focusable elements: https://dequeuniversity.com/rules/axe/3.5/aria-hidden-focus
										tabIndex: ariaHideProfileTrigger ? -1 : 0,
										'aria-label': ariaHideProfileTrigger
											? undefined
											: getLabelMessage(ariaLabel, profilecardProps.fullName, formatMessage),
									})}
							{...(ariaHideProfileTrigger && { 'aria-hidden': 'true' })}
							{...ssrPlaceholderProp}
						>
							{children}
						</span>
					);
				}}
				zIndex={layers.modal()}
				shouldUseCaptureOnOutsideClick
				autoFocus={
					expValEquals('editor_a11y_7152_profile_card_tab_order', 'isEnabled', true)
						? isRenderedInPortal && isTriggeredUsingKeyboard
							? false
							: (autoFocus ?? trigger === 'click')
						: (autoFocus ?? trigger === 'click')
				}
				// This feature gate is currently enabled only for Jira_Web to avoid UI issues in Confluence_Web.
				shouldRenderToParent={fg('enable_appropriate_reading_order_in_profile_card')}
				shouldDisableFocusLock={fg('enable_appropriate_reading_order_in_profile_card')}
			/>
			{shouldShowGiveKudos && teamCentralBaseUrl && (
				<Suspense fallback={null}>
					<GiveKudosLauncherLazy
						isOpen={kudosDrawerOpen}
						recipient={{
							type: KudosType.INDIVIDUAL,
							recipientId: userId!,
						}}
						analyticsSource="profile-card"
						teamCentralBaseUrl={teamCentralBaseUrl}
						cloudId={cloudId!}
						addFlag={addFlag}
						onClose={closeKudosDrawer}
					/>
				</Suspense>
			)}
		</>
	);
}
const LoadingView = ({ fireAnalytics }: { fireAnalytics: FireEventType }) => (
	<CardWrapper testId="profilecard.profilecardtrigger.loading">
		<UserLoadingState fireAnalytics={fireAnalytics} />
	</CardWrapper>
);
