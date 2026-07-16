import React from 'react';

import { useIntl } from 'react-intl';

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
	MEDIA_INSERT_TAB,
} from '@atlaskit/editor-common/analytics';
import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import { getDomRefFromSelection } from '@atlaskit/editor-common/get-dom-ref-from-selection';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { mediaInsertMessages } from '@atlaskit/editor-common/messages';
import {
	PlainOutsideClickTargetRefContext,
	Popup,
	withOuterListeners,
} from '@atlaskit/editor-common/ui';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles';
import { Box, Focusable, Text } from '@atlaskit/primitives/compiled';
import Tabs, { TabList, useTab, useTabPanel } from '@atlaskit/tabs';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { RegisterInsertTab } from '../mediaInsertPluginType';
import type { MediaInsertPickerProps } from '../types';

import { useFocusEditor } from './hooks/use-focus-editor';
import { useUnholyAutofocus } from './hooks/use-unholy-autofocus';
import { LocalMedia } from './LocalMedia';
import { MediaFromURL } from './MediaFromURL';
import { MediaInsertWrapper } from './MediaInsertWrapper';

const PopupWithListeners = withOuterListeners(Popup);
const MEDIA_INSERT_PICKER_ANALYTICS_SOURCE = 'MediaInsertPicker';
const EMPTY_REGISTERED_TABS: RegisterInsertTab[] = [];

type TabAnalyticsMetadata = {
	selectedTab: string;
	selectedTabIndex: number;
};

const getMediaInsertPickerTabSource = (selectedTab: string): string =>
	`${MEDIA_INSERT_PICKER_ANALYTICS_SOURCE} - ${selectedTab}`;

const getNextTabIndexForKey = (
	currentTabIndex: number,
	tabCount: number,
	key: React.KeyboardEvent<HTMLElement>['key'],
): number | undefined => {
	if (key === 'Home') {
		return 0;
	}

	if (key === 'End') {
		return tabCount - 1;
	}

	if (key === 'ArrowRight') {
		return currentTabIndex === tabCount - 1 ? 0 : currentTabIndex + 1;
	}

	if (key === 'ArrowLeft') {
		return currentTabIndex === 0 ? tabCount - 1 : currentTabIndex - 1;
	}

	return undefined;
};

const getLinkTabIndex = (registeredTabCount: number, isOnlyExternalLinks: boolean): number =>
	registeredTabCount + (isOnlyExternalLinks ? 0 : 1);

const TabWithAnalytics = ({
	children,
	onSelectTabForAnalytics,
	selectedTabIndex,
	tabCount,
}: {
	children: React.ReactNode;
	onSelectTabForAnalytics: (selectedTabIndex: number) => void;
	selectedTabIndex: number;
	tabCount: number;
}) => {
	const {
		onClick,
		id,
		'aria-controls': ariaControls,
		'aria-posinset': ariaPosinset,
		'aria-selected': ariaSelected,
		'aria-setsize': ariaSetsize,
		onKeyDown,
		role,
		tabIndex,
	} = useTab();

	const handleClick = React.useCallback(() => {
		onSelectTabForAnalytics(selectedTabIndex);
		onClick();
	}, [onClick, onSelectTabForAnalytics, selectedTabIndex]);

	const handleKeyDown = React.useCallback(
		(event: React.KeyboardEvent<HTMLElement>) => {
			const nextTabIndex = getNextTabIndexForKey(selectedTabIndex, tabCount, event.key);
			if (nextTabIndex !== undefined) {
				onSelectTabForAnalytics(nextTabIndex);
			}

			onKeyDown(event);
		},
		[onKeyDown, onSelectTabForAnalytics, selectedTabIndex, tabCount],
	);

	return (
		<Focusable
			as="div"
			isInset
			onClick={handleClick}
			id={id}
			aria-controls={ariaControls}
			aria-posinset={ariaPosinset}
			aria-selected={ariaSelected}
			aria-setsize={ariaSetsize}
			onKeyDown={handleKeyDown}
			role={role}
			tabIndex={tabIndex}
		>
			<Text weight="medium" color="inherit" maxLines={1}>
				{children}
			</Text>
		</Focusable>
	);
};

/**
 * A custom TabPanel that is non-focusable.
 */
const CustomTabPanel = ({
	children,
	disablePaddingBlockEnd = false,
}: {
	children: React.ReactNode;
	disablePaddingBlockEnd?: boolean;
}) => {
	const tabPanelAttributes = useTabPanel();
	return (
		<Box
			paddingBlockEnd={disablePaddingBlockEnd ? 'space.0' : 'space.150'}
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...tabPanelAttributes}
			tabIndex={-1}
		>
			{children}
		</Box>
	);
};

export const MediaInsertPicker = ({
	api,
	editorView,
	dispatchAnalyticsEvent,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	closeMediaInsertPicker,
	insertMediaSingle,
	insertExternalMediaSingle,
	insertFile,
	isOnlyExternalLinks = false,
	customizedUrlValidation,
	customizedHelperMessage,
}: MediaInsertPickerProps): React.JSX.Element | null => {
	// Tabs registered by other plugins via `api.mediaInsert.actions.registerInsertTab(...)`.
	// Read once per render; the registry is mutated only at plugin setup time so this is stable
	// for the lifetime of an editor instance.
	const registeredTabs = api?.mediaInsert?.actions?.getInsertTabs?.() ?? EMPTY_REGISTERED_TABS;
	const { mediaProvider, isOpen, mountInfo } = useSharedPluginStateWithSelector(
		api,
		['media', 'mediaInsert'],
		(states) => ({
			mediaProvider: states.mediaState?.mediaProvider,
			isOpen: states.mediaInsertState?.isOpen,
			mountInfo: states.mediaInsertState?.mountInfo,
		}),
	);
	let targetRef: HTMLElement | undefined;
	let mountPoint: HTMLElement | undefined;
	if (mountInfo) {
		targetRef = mountInfo.ref;
		mountPoint = mountInfo.mountPoint;
	} else {
		// If targetRef is undefined, target the selection in the editor
		targetRef = getDomRefFromSelection(
			editorView,
			ACTION_SUBJECT_ID.PICKER_MEDIA,
			api?.analytics?.actions,
		);
		mountPoint = popupsMountPoint;
	}

	const intl = useIntl();
	const focusEditor = useFocusEditor({ editorView });
	const { autofocusRef, onPositionCalculated } = useUnholyAutofocus();
	const tabCount = registeredTabs.length + (isOnlyExternalLinks ? 1 : 2);
	const linkTabIndex = getLinkTabIndex(registeredTabs.length, isOnlyExternalLinks);
	const getTabAnalyticsMetadata = React.useCallback(
		(selectedTabIndex: number): TabAnalyticsMetadata => {
			const registeredTab = registeredTabs[selectedTabIndex];
			if (registeredTab) {
				return {
					selectedTab: registeredTab.key,
					selectedTabIndex,
				};
			}

			const uploadTabIndex = registeredTabs.length;
			if (!isOnlyExternalLinks && selectedTabIndex === uploadTabIndex) {
				return {
					selectedTab: MEDIA_INSERT_TAB.UPLOAD,
					selectedTabIndex,
				};
			}

			if (selectedTabIndex === linkTabIndex) {
				return {
					selectedTab: MEDIA_INSERT_TAB.LINK,
					selectedTabIndex,
				};
			}

			return {
				selectedTab: 'unknown',
				selectedTabIndex,
			};
		},
		[isOnlyExternalLinks, linkTabIndex, registeredTabs],
	);
	const selectedTabAnalyticsMetadataRef = React.useRef<TabAnalyticsMetadata>(
		getTabAnalyticsMetadata(0),
	);
	const tabsAnalyticsContext = React.useMemo(
		() => ({
			get source() {
				return getMediaInsertPickerTabSource(selectedTabAnalyticsMetadataRef.current.selectedTab);
			},
		}),
		[],
	);
	const setSelectedTabAnalyticsMetadata = React.useCallback(
		(selectedTabIndex: number) => {
			selectedTabAnalyticsMetadataRef.current = getTabAnalyticsMetadata(selectedTabIndex);
		},
		[getTabAnalyticsMetadata],
	);
	const hasDispatchedInitialTabViewedEventRef = React.useRef(false);
	// Atlaskit Tabs only calls `onChange` after the user changes tabs, so the
	// initially opened tab needs its viewed analytics event dispatched from an
	// effect. The ref keeps this to once per picker open without setting state.
	React.useEffect(() => {
		if (!isOpen) {
			hasDispatchedInitialTabViewedEventRef.current = false;
			return;
		}

		if (
			!mediaProvider ||
			!dispatchAnalyticsEvent ||
			hasDispatchedInitialTabViewedEventRef.current
		) {
			return;
		}

		const selectedTabMetadata = getTabAnalyticsMetadata(0);
		selectedTabAnalyticsMetadataRef.current = selectedTabMetadata;
		const payload: AnalyticsEventPayload = {
			action: ACTION.VIEWED,
			actionSubject: ACTION_SUBJECT.PICKER,
			actionSubjectId: ACTION_SUBJECT_ID.PICKER_MEDIA,
			eventType: EVENT_TYPE.UI,
			attributes: {
				selectedTab: selectedTabMetadata.selectedTab,
				selectedTabIndex: selectedTabMetadata.selectedTabIndex,
			},
		};
		dispatchAnalyticsEvent(payload);
		hasDispatchedInitialTabViewedEventRef.current = true;
	}, [dispatchAnalyticsEvent, getTabAnalyticsMetadata, isOpen, mediaProvider]);
	const handleTabChange = React.useCallback(
		(selectedTabIndex: number, analyticsEvent: UIAnalyticsEvent) => {
			const selectedTabMetadata = getTabAnalyticsMetadata(selectedTabIndex);
			selectedTabAnalyticsMetadataRef.current = selectedTabMetadata;
			analyticsEvent
				.update((payload) => ({
					...payload,
					attributes: {
						...payload.attributes,
						selectedTab: selectedTabMetadata.selectedTab,
						selectedTabIndex,
					},
				}))
				.fire();

			if (dispatchAnalyticsEvent) {
				const payload: AnalyticsEventPayload = {
					action: ACTION.VIEWED,
					actionSubject: ACTION_SUBJECT.PICKER,
					actionSubjectId: ACTION_SUBJECT_ID.PICKER_MEDIA,
					eventType: EVENT_TYPE.UI,
					attributes: {
						selectedTab: selectedTabMetadata.selectedTab,
						selectedTabIndex,
					},
				};
				dispatchAnalyticsEvent(payload);
			}
		},
		[dispatchAnalyticsEvent, getTabAnalyticsMetadata],
	);

	if (!isOpen || !mediaProvider) {
		return null;
	}

	const handleClose =
		(exitMethod: INPUT_METHOD.KEYBOARD | INPUT_METHOD.MOUSE) => (event: Event) => {
			// Same as AIImageGenerationPopup: react-select can detach the option
			// before `click` fires, so withOuterListeners treats it as outside.
			if (
				exitMethod === INPUT_METHOD.MOUSE &&
				event.target instanceof Node &&
				!event.target.isConnected
			) {
				return;
			}
			event.preventDefault();
			if (dispatchAnalyticsEvent) {
				const payload: AnalyticsEventPayload = {
					action: ACTION.CLOSED,
					actionSubject: ACTION_SUBJECT.PICKER,
					actionSubjectId: ACTION_SUBJECT_ID.PICKER_MEDIA,
					eventType: EVENT_TYPE.UI,
					attributes: { exitMethod },
				};
				dispatchAnalyticsEvent(payload);
			}
			closeMediaInsertPicker(); // Focuses editor on unmount
			if (!expValEquals('platform_editor_fix_focus_MediaInsertPicker', 'isEnabled', true)) {
				focusEditor();
			}
		};

	const fileTabTitle = expValEqualsNoExposure(
		'cc_page_experiences_editor_image_generation',
		'isEnabled',
		true,
	)
		? intl.formatMessage(mediaInsertMessages.uploadTabTitle)
		: intl.formatMessage(mediaInsertMessages.fileTabTitle);

	return (
		<PopupWithListeners
			ariaLabel={intl.formatMessage(mediaInsertMessages.mediaPickerPopupAriaLabel)}
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			offset={[0, 12]}
			target={targetRef}
			zIndex={akEditorFloatingDialogZIndex}
			fitHeight={390}
			fitWidth={340}
			mountTo={mountPoint}
			onUnmount={
				expValEquals('platform_editor_fix_focus_MediaInsertPicker', 'isEnabled', true)
					? focusEditor
					: undefined
			}
			boundariesElement={popupsBoundariesElement}
			handleClickOutside={handleClose(INPUT_METHOD.MOUSE)}
			handleEscapeKeydown={handleClose(INPUT_METHOD.KEYBOARD)}
			scrollableElement={popupsScrollableElement}
			preventOverflow={true}
			onPositionCalculated={onPositionCalculated}
			focusTrap
		>
			<PlainOutsideClickTargetRefContext.Consumer>
				{(setOutsideClickTargetRef) => (
					<MediaInsertWrapper ref={setOutsideClickTargetRef}>
						<Tabs
							id="media-insert-tab-navigation"
							analyticsContext={tabsAnalyticsContext}
							onChange={handleTabChange}
						>
							<Box paddingBlockEnd="space.150">
								<TabList>
									{registeredTabs.map((tab, index) => (
										<TabWithAnalytics
											key={tab.key}
											onSelectTabForAnalytics={setSelectedTabAnalyticsMetadata}
											selectedTabIndex={index}
											tabCount={tabCount}
										>
											{tab.label}
										</TabWithAnalytics>
									))}
									{!isOnlyExternalLinks && (
										<TabWithAnalytics
											onSelectTabForAnalytics={setSelectedTabAnalyticsMetadata}
											selectedTabIndex={registeredTabs.length}
											tabCount={tabCount}
										>
											{fileTabTitle}
										</TabWithAnalytics>
									)}
									<TabWithAnalytics
										onSelectTabForAnalytics={setSelectedTabAnalyticsMetadata}
										selectedTabIndex={linkTabIndex}
										tabCount={tabCount}
									>
										{intl.formatMessage(mediaInsertMessages.linkTabTitle)}
									</TabWithAnalytics>
								</TabList>
							</Box>
							{registeredTabs.map(({ key, component: TabComponent }) => (
								<CustomTabPanel key={key} disablePaddingBlockEnd>
									<TabComponent
										// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
										closeMediaInsertPicker={() => {
											closeMediaInsertPicker(); // Focuses editor on unmount
											if (
												!expValEquals(
													'platform_editor_fix_focus_MediaInsertPicker',
													'isEnabled',
													true,
												)
											) {
												focusEditor();
											}
										}}
										dispatchAnalyticsEvent={dispatchAnalyticsEvent}
										insertMediaSingle={insertMediaSingle}
										mediaProvider={mediaProvider}
									/>
								</CustomTabPanel>
							))}
							{!isOnlyExternalLinks && (
								<CustomTabPanel>
									<LocalMedia
										ref={autofocusRef}
										mediaProvider={mediaProvider}
										// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
										closeMediaInsertPicker={() => {
											closeMediaInsertPicker(); // Focuses editor on unmount
											if (
												!expValEquals(
													'platform_editor_fix_focus_MediaInsertPicker',
													'isEnabled',
													true,
												)
											) {
												focusEditor();
											}
										}}
										dispatchAnalyticsEvent={dispatchAnalyticsEvent}
										insertFile={insertFile}
									/>
								</CustomTabPanel>
							)}
							<CustomTabPanel>
								<MediaFromURL
									mediaProvider={mediaProvider}
									dispatchAnalyticsEvent={dispatchAnalyticsEvent}
									// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
									closeMediaInsertPicker={() => {
										closeMediaInsertPicker(); // Focuses editor on unmount
										if (
											!expValEquals(
												'platform_editor_fix_focus_MediaInsertPicker',
												'isEnabled',
												true,
											)
										) {
											focusEditor();
										}
									}}
									insertMediaSingle={insertMediaSingle}
									insertExternalMediaSingle={insertExternalMediaSingle}
									isOnlyExternalLinks={isOnlyExternalLinks}
									customizedUrlValidation={customizedUrlValidation}
									customizedHelperMessage={customizedHelperMessage}
								/>
							</CustomTabPanel>
						</Tabs>
					</MediaInsertWrapper>
				)}
			</PlainOutsideClickTargetRefContext.Consumer>
		</PopupWithListeners>
	);
};
