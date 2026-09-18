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
import {
	DEFAULT_MEDIA_INSERT_TAB_RANK,
	MEDIA_INSERT_TAB_RANK,
} from '@atlaskit/editor-common/media-insert/rank';
import { mediaInsertMessages } from '@atlaskit/editor-common/messages';
import {
	PlainOutsideClickTargetRefContext,
	Popup,
	withOuterListeners,
} from '@atlaskit/editor-common/ui';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { Box, Focusable, Text } from '@atlaskit/primitives/compiled';
import TabList from '@atlaskit/tabs/tab-list';
import Tabs from '@atlaskit/tabs/tabs';
import useTab from '@atlaskit/tabs/use-tab';
import useTabPanel from '@atlaskit/tabs/use-tab-panel';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { RegisterInsertTab } from '../mediaInsertPluginType';
import type { MediaInsertPickerProps } from '../types';
import { useFocus } from './hooks/use-focus';
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

type OrderedMediaInsertTab =
	| {
			key: MEDIA_INSERT_TAB.LINK | MEDIA_INSERT_TAB.UPLOAD;
			rank: number;
			tieBreaker: number;
			type: 'link' | 'upload';
	  }
	| {
			key: string;
			rank: number;
			registeredTab: RegisterInsertTab;
			tieBreaker: number;
			type: 'registered';
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

	const focusButton = useFocus({ target: targetRef ?? editorView });
	const focusEditor = useFocus({ target: editorView });
	// returnFocusRef stores which function we call on unmount: focusButton | focusEditor
	// Needs to be a ref so we can instantly toggle it before unmounting triggers the focus trap
	const returnFocusRef = React.useRef(focusEditor);
	// When inserting media, close picker and focus editor.
	const closeAndFocusEditor = React.useCallback(() => {
		returnFocusRef.current = focusEditor;
		closeMediaInsertPicker();
	}, [closeMediaInsertPicker, focusEditor]);
	// When cancelling, close picker and return focus to button.
	const closeAndReturnFocusToButton = React.useCallback(() => {
		returnFocusRef.current = focusButton;
		closeMediaInsertPicker();
	}, [closeMediaInsertPicker, focusButton]);

	const intl = useIntl();
	const { autofocusRef, onPositionCalculated } = useUnholyAutofocus();
	const orderedTabs = React.useMemo<OrderedMediaInsertTab[]>(() => {
		const tabs: OrderedMediaInsertTab[] = [];
		let tieBreaker = 0;
		if (!isOnlyExternalLinks) {
			tabs.push({
				key: MEDIA_INSERT_TAB.UPLOAD,
				rank: MEDIA_INSERT_TAB_RANK[MEDIA_INSERT_TAB.UPLOAD],
				tieBreaker: tieBreaker++,
				type: 'upload',
			});
		}
		tabs.push({
			key: MEDIA_INSERT_TAB.LINK,
			rank: MEDIA_INSERT_TAB_RANK[MEDIA_INSERT_TAB.LINK],
			tieBreaker: tieBreaker++,
			type: 'link',
		});
		registeredTabs.forEach((registeredTab) => {
			tabs.push({
				key: registeredTab.key,
				rank: registeredTab.rank ?? DEFAULT_MEDIA_INSERT_TAB_RANK,
				registeredTab,
				tieBreaker: tieBreaker++,
				type: 'registered',
			});
		});
		return tabs.sort((a, b) => a.rank - b.rank || a.tieBreaker - b.tieBreaker);
	}, [isOnlyExternalLinks, registeredTabs]);
	const tabCount = orderedTabs.length;
	const getTabAnalyticsMetadata = React.useCallback(
		(selectedTabIndex: number): TabAnalyticsMetadata => {
			const selectedTab = orderedTabs[selectedTabIndex];
			if (selectedTab) {
				return {
					selectedTab: selectedTab.key,
					selectedTabIndex,
				};
			}

			return {
				selectedTab: 'unknown',
				selectedTabIndex,
			};
		},
		[orderedTabs],
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
			if (isExperimentEnabled('platform_editor_fix_focus_mediainsertpicker')) {
				closeAndReturnFocusToButton();
			} else {
				closeMediaInsertPicker(); // Focuses editor on unmount
				focusEditor();
			}
		};
	const closePickerAndFocusEditor = () => {
		if (isExperimentEnabled('platform_editor_fix_focus_mediainsertpicker')) {
			closeAndFocusEditor();
		} else {
			closeMediaInsertPicker();
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
				isExperimentEnabled('platform_editor_fix_focus_mediainsertpicker')
					? () => returnFocusRef.current()
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
									{orderedTabs.map((tab, index) => (
										<TabWithAnalytics
											key={tab.key}
											onSelectTabForAnalytics={setSelectedTabAnalyticsMetadata}
											selectedTabIndex={index}
											tabCount={tabCount}
										>
											{tab.type === 'registered'
												? tab.registeredTab.label
												: tab.type === 'upload'
													? fileTabTitle
													: intl.formatMessage(mediaInsertMessages.linkTabTitle)}
										</TabWithAnalytics>
									))}
								</TabList>
							</Box>
							{orderedTabs.map((tab) => {
								if (tab.type === 'registered') {
									const TabComponent = tab.registeredTab.component;
									return (
										<CustomTabPanel key={tab.key} disablePaddingBlockEnd>
											<TabComponent
												closeMediaInsertPicker={closePickerAndFocusEditor}
												dispatchAnalyticsEvent={dispatchAnalyticsEvent}
												insertMediaSingle={insertMediaSingle}
												mediaProvider={mediaProvider}
											/>
										</CustomTabPanel>
									);
								}

								if (tab.type === 'upload') {
									return (
										<CustomTabPanel key={tab.key}>
											<LocalMedia
												ref={autofocusRef}
												mediaProvider={mediaProvider}
												closeMediaInsertPicker={closePickerAndFocusEditor}
												dispatchAnalyticsEvent={dispatchAnalyticsEvent}
												insertFile={insertFile}
											/>
										</CustomTabPanel>
									);
								}

								return (
									<CustomTabPanel key={tab.key}>
										<MediaFromURL
											mediaProvider={mediaProvider}
											dispatchAnalyticsEvent={dispatchAnalyticsEvent}
											closeMediaInsertPicker={closePickerAndFocusEditor}
											cancelMediaInsertPicker={closeAndReturnFocusToButton}
											insertMediaSingle={insertMediaSingle}
											insertExternalMediaSingle={insertExternalMediaSingle}
											isOnlyExternalLinks={isOnlyExternalLinks}
											customizedUrlValidation={customizedUrlValidation}
											customizedHelperMessage={customizedHelperMessage}
										/>
									</CustomTabPanel>
								);
							})}
						</Tabs>
					</MediaInsertWrapper>
				)}
			</PlainOutsideClickTargetRefContext.Consumer>
		</PopupWithListeners>
	);
};
