/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { getDocument } from '@atlaskit/browser-apis';
import { IconButton } from '@atlaskit/button/new';
import Button from '@atlaskit/button/standard-button';
import { cssMap, jsx } from '@atlaskit/css';
import { Drawer } from '@atlaskit/drawer';
import ArrowLeft from '@atlaskit/icon/core/arrow-left';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import IntlMessagesProvider from '@atlaskit/intl-messages-provider/main';
import Link from '@atlaskit/link';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { fg } from '@atlaskit/platform-feature-flags';
import Portal from '@atlaskit/portal';
import { Inline } from '@atlaskit/primitives/compiled';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { fetchMessagesForLocale } from '../../common/utils/fetch-messages-for-locale';
import i18nEN from '../../i18n/en';
import messages from '../../messages';
import {
	type Flag,
	type FlagEvent,
	FlagEventType,
	type GiveKudosDrawerProps,
	isFlagEventTypeValue,
	KudosType,
} from '../../types';

const styles = cssMap({
	drawerCloseButtonContainer: {
		position: 'absolute',
		top: token('space.200'),
		left: token('space.200'),
	},
	iframe: {
		border: 'none',
	},
});

const ANALYTICS_CHANNEL = 'atlas';

export const isTrustedOrigin = (baseUrl: string, eventOrigin: string): boolean => {
	try {
		return new URL(baseUrl).origin === eventOrigin;
	} catch {
		return false;
	}
};

export const isSafeHttpsUrl = (url: string | undefined): url is string =>
	url ? new URL(url).protocol === 'https:' : false;

const GiveKudosLauncher = (props: GiveKudosDrawerProps) => {
	const [isCloseConfirmModalOpen, setIsCloseConfirmModalOpen] = useState(false);
	const [isDirty, setIsDirty] = useState(false);
	const iframeEl = useRef<HTMLIFrameElement>(null);
	const backButtonRef = useRef<HTMLButtonElement>(null);
	const messageListenerEventHandler = useRef((_e: any) => {});
	const unloadEventHandler = useRef((_e: any) => {});
	const focusGuardCleanupRef = useRef<(() => void) | null>(null);
	const intl = useIntl();
	const { createAnalyticsEvent } = useAnalyticsEvents();

	const {
		addFlag,
		teamCentralBaseUrl,
		analyticsSource,
		onClose,
		testId,
		onCreateKudosSuccess,
		isActionsEnabled,
		zIndex = layers.modal(),
	} = props;

	const shouldBlockTransition = useCallback(
		(e: Event & { returnValue: any }) => {
			e.preventDefault();
			e.returnValue = intl.formatMessage(messages.unsavedKudosWarning);
		},
		[intl],
	);

	const sendAnalytic = useCallback(
		(action: 'cancelled' | 'opened', options: any) => {
			const analyticsEvent = createAnalyticsEvent({
				action: action,
				actionSubject: 'createKudos',
				attributes: {
					...options,
					analyticsSource,
					teamId:
						props.recipient?.type === KudosType.TEAM ? props.recipient.recipientId : undefined,
					KudosType: props.recipient?.type,
					recipientId: props.recipient?.recipientId,
					...(action === 'opened' && props.openedEventAttributes),
				},
			});
			analyticsEvent.fire(ANALYTICS_CHANNEL);
		},
		[analyticsSource, createAnalyticsEvent, props.recipient, props.openedEventAttributes],
	);

	const closeDrawer = useCallback(() => {
		setIsDirty(false);
		setIsCloseConfirmModalOpen(false);
		onClose();
	}, [onClose]);

	const focusBackButton = useCallback(() => {
		backButtonRef.current?.focus();
	}, []);

	// After the iframe loads, its form autofocuses an input and steals focus from
	// the back button. Focus the back button and, for a short grace period,
	// restore it whenever focus moves into the iframe.
	const handleIframeLoad = useCallback(() => {
		if (!fg('teams-a11y-35569-35538-35421')) {
			return;
		}

		focusGuardCleanupRef.current?.();
		focusBackButton();

		const handleWindowBlur = () => {
			window.setTimeout(() => {
				if (getDocument()?.activeElement === iframeEl.current) {
					focusBackButton();
				}
			}, 0);
		};

		window.addEventListener('blur', handleWindowBlur);

		const gracePeriodTimer = window.setTimeout(() => {
			window.removeEventListener('blur', handleWindowBlur);
			focusGuardCleanupRef.current = null;
		}, 1000);

		focusGuardCleanupRef.current = () => {
			window.clearTimeout(gracePeriodTimer);
			window.removeEventListener('blur', handleWindowBlur);
		};
	}, [focusBackButton]);

	useEffect(() => () => focusGuardCleanupRef.current?.(), []);

	const closeWarningModal = () => {
		setIsCloseConfirmModalOpen(false);
	};

	const createFlagWithJsonStringifiedInput = useCallback(
		(flagEvent: FlagEvent) => {
			const handleCreateOrFail = (addFlagConfig: Flag) => {
				closeDrawer();
				addFlag && addFlag(addFlagConfig);
				onCreateKudosSuccess && addFlagConfig.type === 'success' && onCreateKudosSuccess(flagEvent);
			};

			switch (flagEvent.eventType) {
				case FlagEventType.KUDOS_CREATED:
					handleCreateOrFail({
						title: <FormattedMessage {...messages.kudosCreatedFlag} />,
						id: `kudosCreatedFlag-${flagEvent.kudosUuid}`,
						description: (
							<FormattedMessage
								{...messages.kudosCreatedDescriptionFlag}
								values={{
									a: (s: React.ReactNode[]) => (
										<Link href={`${teamCentralBaseUrl}/people/kudos/${flagEvent.kudosUuid}`}>
											{s}
										</Link>
									),
								}}
							/>
						),
						actions: isActionsEnabled
							? [
									{
										content: (
											<Inline space="space.050" alignBlock="center">
												<FormattedMessage {...messages.kudosCreatedActionFlag} />
												<LinkExternalIcon label="" color="currentColor" />
											</Inline>
										),
										href: `${teamCentralBaseUrl}/people/kudos/${flagEvent.kudosUuid}`,
										target: '_blank',
										onClick: () => undefined,
									},
								]
							: undefined,
						type: 'success',
					});
					break;
				case FlagEventType.KUDOS_FAILED:
					handleCreateOrFail({
						title: <FormattedMessage {...messages.kudosCreationFailedFlag} />,
						id: `jiraKudosCreationFailedFlag-${flagEvent.kudosUuid}`,
						description: <FormattedMessage {...messages.kudosCreationFailedDescriptionFlag} />,
						type: 'error',
					});
					break;
				case FlagEventType.JIRA_KUDOS_CREATED: {
					if (!isSafeHttpsUrl(flagEvent.jiraKudosUrl)) {
						return;
					}
					handleCreateOrFail({
						title: <FormattedMessage {...messages.JiraKudosCreatedFlag} />,
						id: `kudosCreatedFlag-${flagEvent.kudosUuid}`,
						description: <FormattedMessage {...messages.JiraKudosCreatedDescriptionFlag} />,
						type: 'success',
						actions: [
							{
								content: 'Track gift request',
								href: flagEvent.jiraKudosUrl ?? '',
							},
							{
								content: 'View kudos',
								href: `${teamCentralBaseUrl}/people/kudos/${flagEvent.kudosUuid}`,
							},
						],
					});
					break;
				}
				case FlagEventType.JIRA_KUDOS_FAILED: {
					if (!isSafeHttpsUrl(flagEvent.jiraKudosFormUrl)) {
						return;
					}
					handleCreateOrFail({
						title: <FormattedMessage {...messages.JiraKudosCreationFailedFlag} />,
						id: `jiraKudosCreationFailedFlag-${flagEvent.kudosUuid}`,
						description: (
							<FormattedMessage
								{...messages.JiraKudosCreationFailedDescriptionFlag}
								values={{
									a: (s: React.ReactNode[]) => (
										<Link href={flagEvent.jiraKudosFormUrl ?? ''}>{s}</Link>
									),
								}}
							/>
						),
						type: 'error',
						actions: [
							{
								content: 'Visit go/kudos',
								href: flagEvent.jiraKudosFormUrl,
							},
							{
								content: 'View kudos',
								href: `${teamCentralBaseUrl}/people/kudos/${flagEvent.kudosUuid}`,
							},
						],
					});
					break;
				}
				case FlagEventType.DIRTY:
					setIsDirty(true);
					break;
				case FlagEventType.CLOSE:
					closeDrawer();
					break;
				default:
					// Not a known FlagEventType
					return;
			}
		},
		[addFlag, closeDrawer, teamCentralBaseUrl, onCreateKudosSuccess, isActionsEnabled],
	);

	const messageListener = useCallback(
		(event: any) => {
			if (!props.isOpen) {
				return;
			}

			if (!isTrustedOrigin(teamCentralBaseUrl, event.origin)) {
				return;
			}

			if (event.data === 'dirty') {
				setIsDirty(true);
			} else if (event.data === 'close') {
				closeDrawer();
			} else {
				try {
					const eventData = JSON.parse(event.data);
					if (eventData.eventType && isFlagEventTypeValue(eventData.eventType)) {
						createFlagWithJsonStringifiedInput(eventData);
					}
				} catch {
					// Swallow any errors
				}
			}
		},
		[props.isOpen, teamCentralBaseUrl, closeDrawer, createFlagWithJsonStringifiedInput],
	);

	useEffect(() => {
		window.removeEventListener('message', messageListenerEventHandler.current);
		messageListenerEventHandler.current = messageListener;
		window.addEventListener('message', messageListenerEventHandler.current, false);
		return () => {
			window.removeEventListener('message', messageListenerEventHandler.current);
		};
	}, [messageListener]);

	useEffect(() => {
		window.removeEventListener('beforeunload', unloadEventHandler.current);
		if (isDirty) {
			unloadEventHandler.current = shouldBlockTransition;
			window.addEventListener('beforeunload', unloadEventHandler.current, false);
		}
		return () => {
			window.removeEventListener('beforeunload', unloadEventHandler.current);
		};
	}, [isDirty, shouldBlockTransition]);

	const sendCancelAnalytic = () => {
		sendAnalytic('cancelled', {});
	};

	const handleCloseDrawerClickedFunc = () => {
		if (!isDirty) {
			sendCancelAnalytic();
			closeDrawer();
			return;
		}

		setIsCloseConfirmModalOpen(true);
	};

	const handleCloseDrawerClickedFuncRef = useRef(handleCloseDrawerClickedFunc);

	useEffect(() => {
		handleCloseDrawerClickedFuncRef.current = handleCloseDrawerClickedFunc;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isDirty]);

	const handleCloseDrawerClicked = () => {
		handleCloseDrawerClickedFuncRef.current();
	};

	const recipientParam = props.recipient
		? `&type=${props.recipient.type}&recipientId=${props.recipient.recipientId}`
		: '';
	const populateRecipientsViaParam = props.prepopulateRecipientsVia
		? `&entityType=${props.prepopulateRecipientsVia.entityType}&entityARI=${props.prepopulateRecipientsVia.entityARI}`
		: '';
	const giveKudosUrl = `${props.teamCentralBaseUrl}/give-kudos?cloudId=${
		props.cloudId
	}${recipientParam}${populateRecipientsViaParam}&unsavedMessage=${intl.formatMessage(messages.unsavedKudosWarning)}`;

	const renderDrawer = useMemo(() => {
		if (props.isOpen) {
			sendAnalytic('opened', {});
		}
		return (
			<Drawer width="full" isOpen={props.isOpen} zIndex={zIndex} onClose={handleCloseDrawerClicked}>
				<div css={styles.drawerCloseButtonContainer}>
					<IconButton
						ref={backButtonRef}
						onClick={handleCloseDrawerClicked}
						icon={ArrowLeft}
						label={intl.formatMessage(messages.closeDrawerButtonLabel)}
						shape="circle"
						appearance="subtle"
					/>
				</div>
				<iframe
					src={giveKudosUrl}
					ref={iframeEl}
					width="100%"
					height="100%"
					frameBorder="0"
					allow="camera;microphone"
					css={styles.iframe}
					title={intl.formatMessage(messages.giveKudosButton)}
					onLoad={handleIframeLoad}
				/>
			</Drawer>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.recipient?.recipientId, props.isOpen]);

	return (
		<Portal zIndex={zIndex}>
			<div data-testid={testId}>
				<ModalTransition>
					{isCloseConfirmModalOpen && (
						<Modal onClose={closeWarningModal} width="small">
							<ModalHeader>
								<ModalTitle>
									<FormattedMessage {...messages.confirmCloseTitle} />
								</ModalTitle>
							</ModalHeader>
							<ModalBody>
								<FormattedMessage {...messages.unsavedKudosWarning} />
							</ModalBody>
							<ModalFooter>
								<Button appearance="subtle" onClick={closeWarningModal}>
									<FormattedMessage {...messages.unsavedKudosWarningCancelButton} />
								</Button>
								<Button
									appearance="primary"
									onClick={() => {
										sendCancelAnalytic();
										closeDrawer();
									}}
								>
									<FormattedMessage {...messages.unsavedKudosWarningCloseButton} />
								</Button>
							</ModalFooter>
						</Modal>
					)}
				</ModalTransition>
				{renderDrawer}
			</div>
		</Portal>
	);
};

const ComposedGiveKudosLauncher = (props: GiveKudosDrawerProps): JSX.Element => {
	return (
		<IntlMessagesProvider loaderFn={fetchMessagesForLocale} defaultMessages={i18nEN}>
			<GiveKudosLauncher {...props} />
		</IntlMessagesProvider>
	);
};

export default ComposedGiveKudosLauncher;
