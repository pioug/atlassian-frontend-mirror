import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cssMap } from '@compiled/react';
import { useIntl } from 'react-intl-next';

import { type AnalyticsEventPayload, useAnalyticsEvents } from '@atlaskit/analytics-next';
import { GiveKudosLauncherLazy, KudosType } from '@atlaskit/give-kudos';
import { fg } from '@atlaskit/platform-feature-flags';
import Popup from '@atlaskit/popup';
import { Box } from '@atlaskit/primitives/compiled';
import {
	type FireEventType,
	useAnalyticsEvents as useAnalyticsEventsNext,
} from '@atlaskit/teams-app-internal-analytics';
import { layers } from '@atlaskit/theme/constants';

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
import { cardTriggered, fireEvent, PACKAGE_META_DATA } from '../../util/analytics';
import { DELAY_MS_HIDE, DELAY_MS_SHOW } from '../../util/config';
import { getPageTime } from '../../util/performance';
import { AgentProfileCardResourced } from '../Agent/AgentProfileCardResourced';

import { ProfileCardLazy } from './lazyProfileCard';
import UserLoadingState from './UserLoadingState';

const styles = cssMap({
	profileCardTrigger: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'#profile-card-trigger-popup-wrapper': {
			zIndex: layers.modal(),
		},
	},
});

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
	addFlag,
	hideAgentMoreActions,
}: {
	profilecardProps: ProfilecardProps;
	userId: string;
	cloudId: string;
	resourceClient: ProfileClient;
	viewingUserId?: string;
	trigger?: TriggerType;
	product?: string;
	isAgent: boolean;
	profileCardAction: ProfileCardAction[];
	hasError?: boolean;
	errorType?: ProfileCardErrorType;
	agentActions?: AgentActionsType;
	addFlag?: (flag: Flag) => void;
	hideAgentMoreActions?: boolean;
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
			/>
		);
	} else {
		return (
			<Suspense fallback={null}>
				<ProfileCardLazy
					{...profilecardProps}
					actions={profileCardAction}
					hasError={hasError}
					errorType={errorType}
					withoutElevation
				/>
			</Suspense>
		);
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
	ariaHideProfileTrigger = false,
	isVisible: propsIsVisible,
	ssrPlaceholderId,
	showDelay: customShowDelay,
	hideDelay: customHideDelay,
}: ProfileCardTriggerProps) {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { formatMessage } = useIntl();

	const isMounted = useRef(false);

	const [visible, setVisible] = useState<boolean>(false);
	const showTimer = useRef<number>(0);
	const hideTimer = useRef<number>(0);

	const isExternalControl = propsIsVisible !== undefined && propsIsVisible !== visible;
	const showDelay =
		trigger === 'click' || (isExternalControl && fg('fix_profilecard_trigger_isvisible'))
			? 0
			: (customShowDelay ?? DELAY_MS_SHOW);
	const hideDelay =
		trigger === 'click' || (isExternalControl && fg('fix_profilecard_trigger_isvisible'))
			? 0
			: (customHideDelay ?? DELAY_MS_HIDE);

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
	const { fireEvent: fireEventNext } = useAnalyticsEventsNext();

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

	// Create a wrapper function that has the same interface as fireEventNext but includes isMounted check
	const fireAnalyticsNext: FireEventType = useCallback(
		(eventKey, ...attributes) => {
			if (!isMounted.current) {
				return;
			}
			fireEventNext(eventKey, ...attributes);
		},
		[fireEventNext],
	);

	const fireAnalytics = useCallback(
		(payload: AnalyticsEventPayload) => {
			// Don't fire any analytics if the component is unmounted
			if (!isMounted.current) {
				return;
			}

			fireEvent(createAnalyticsEvent, payload);
		},
		[createAnalyticsEvent],
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
			const requests = Promise.all([
				resourceClient.getProfile(cloudId || '', userId, fireAnalytics, fireAnalyticsNext),
				resourceClient.getReportingLines(userId),
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
		fireAnalyticsNext,
		isLoading,
		resourceClient,
		userId,
		handleClientSuccess,
		handleClientError,
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
				if (fg('ptc-enable-profile-card-analytics-refactor')) {
					fireAnalyticsNext('ui.profilecard.triggered', {
						method: 'click',
						firedAt: Math.round(getPageTime()),
						...PACKAGE_META_DATA,
					});
				} else {
					fireAnalytics(cardTriggered('user', 'click'));
				}
			}
		},
		[fireAnalytics, fireAnalyticsNext, showProfilecard, visible],
	);

	const onMouseEnter = useCallback(() => {
		showProfilecard();

		if (!visible) {
			if (fg('ptc-enable-profile-card-analytics-refactor')) {
				fireAnalyticsNext('ui.profilecard.triggered', {
					method: 'hover',
					firedAt: Math.round(getPageTime()),
					...PACKAGE_META_DATA,
				});
			} else {
				fireAnalytics(cardTriggered('user', 'hover'));
			}
		}
	}, [fireAnalytics, fireAnalyticsNext, showProfilecard, visible]);

	const onKeyPress = useCallback(
		(event: React.KeyboardEvent) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				setTriggeredUsingKeyboard(true);
				showProfilecard();
				if (!visible) {
					if (fg('ptc-enable-profile-card-analytics-refactor')) {
						fireAnalyticsNext('ui.profilecard.triggered', {
							method: 'click',
							firedAt: Math.round(getPageTime()),
							...PACKAGE_META_DATA,
						});
					} else {
						fireAnalytics(cardTriggered('user', 'click'));
					}
				}
			}
		},
		[fireAnalytics, fireAnalyticsNext, showProfilecard, visible],
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
	};

	const ssrPlaceholderProp = ssrPlaceholderId
		? { 'data-ssr-placeholder-replace': ssrPlaceholderId }
		: {};

	if (fg('enable_absolute_positioning_profile_card')) {
		return (
			<>
				<Box as="span" xcss={styles.profileCardTrigger}>
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
									<LoadingView
										fireAnalytics={fireAnalytics}
										fireAnalyticsNext={fireAnalyticsNext}
									/>
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
						autoFocus={autoFocus ?? trigger === 'click'}
						shouldRenderToParent={
							fg('enable_appropriate_reading_order_in_profile_card') ||
							fg('enable_absolute_positioning_profile_card')
						}
						shouldDisableFocusLock={
							fg('enable_appropriate_reading_order_in_profile_card') ||
							fg('enable_absolute_positioning_profile_card')
						}
						strategy="absolute"
						id="profile-card-trigger-popup-wrapper"
					/>
				</Box>
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
							<LoadingView fireAnalytics={fireAnalytics} fireAnalyticsNext={fireAnalyticsNext} />
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
				autoFocus={autoFocus ?? trigger === 'click'}
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
const LoadingView = ({
	fireAnalytics,
	fireAnalyticsNext,
}: {
	fireAnalytics: (payload: AnalyticsEventPayload) => void;
	fireAnalyticsNext: FireEventType;
}) => (
	<CardWrapper testId="profilecard.profilecardtrigger.loading">
		<UserLoadingState fireAnalytics={fireAnalytics} fireAnalyticsNext={fireAnalyticsNext} />
	</CardWrapper>
);
