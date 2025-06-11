import React from 'react';

import { useIntl } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import { getDomRefFromSelection } from '@atlaskit/editor-common/get-dom-ref-from-selection';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { mediaInsertMessages } from '@atlaskit/editor-common/messages';
import {
	PlainOutsideClickTargetRefContext,
	Popup,
	withOuterListeners,
} from '@atlaskit/editor-common/ui';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import Tabs, { Tab, TabList, useTabPanel } from '@atlaskit/tabs';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { type MediaInsertPickerProps } from '../types';

import { useFocusEditor } from './hooks/use-focus-editor';
import { useUnholyAutofocus } from './hooks/use-unholy-autofocus';
import { LocalMedia } from './LocalMedia';
import { MediaFromURL } from './MediaFromURL';
import { MediaFromURLWithForm } from './MediaFromURLWithForm';
import { MediaInsertWrapper } from './MediaInsertWrapper';

const PopupWithListeners = withOuterListeners(Popup);

/**
 * A custom TabPanel that is non-focusable.
 */
const CustomTabPanel = ({ children }: { children: React.ReactNode }) => {
	const tabPanelAttributes = useTabPanel();
	return (
		// Ignored via go/ees005
		// eslint-disable-next-line react/jsx-props-no-spreading
		<Box paddingBlockEnd="space.150" {...tabPanelAttributes} tabIndex={-1}>
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
}: MediaInsertPickerProps) => {
	const { isOpen: oldIsOpen, mountInfo: oldMountInfo } =
		useSharedPluginState(api, ['mediaInsert'], {
			disabled: expValEquals('platform_editor_usesharedpluginstateselector', 'isEnabled', true),
		})?.mediaInsertState ?? {};
	const oldMediaProvider = useSharedPluginState(api, ['media'], {
		disabled: expValEquals('platform_editor_usesharedpluginstateselector', 'isEnabled', true),
	})?.mediaState?.mediaProvider;
	const isOpenSelector = useSharedPluginStateSelector(api, 'mediaInsert.isOpen', {
		disabled: !expValEquals('platform_editor_usesharedpluginstateselector', 'isEnabled', true),
	});
	const mountInfoSelector = useSharedPluginStateSelector(api, 'mediaInsert.mountInfo', {
		disabled: !expValEquals('platform_editor_usesharedpluginstateselector', 'isEnabled', true),
	});
	const mediaProviderSelector = useSharedPluginStateSelector(api, 'media.mediaProvider', {
		disabled: !expValEquals('platform_editor_usesharedpluginstateselector', 'isEnabled', true),
	});

	const isOpen = expValEquals('platform_editor_usesharedpluginstateselector', 'isEnabled', true)
		? isOpenSelector
		: oldIsOpen;
	const mountInfo = expValEquals('platform_editor_usesharedpluginstateselector', 'isEnabled', true)
		? mountInfoSelector
		: oldMountInfo;
	const mediaProvider = expValEquals(
		'platform_editor_usesharedpluginstateselector',
		'isEnabled',
		true,
	)
		? mediaProviderSelector
		: oldMediaProvider;

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

	if (!isOpen || !mediaProvider) {
		return null;
	}

	const handleClose =
		(exitMethod: INPUT_METHOD.KEYBOARD | INPUT_METHOD.MOUSE) => (event: Event) => {
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
			closeMediaInsertPicker();
			focusEditor();
		};
	return (
		<PopupWithListeners
			ariaLabel={intl.formatMessage(mediaInsertMessages.mediaPickerPopupAriaLabel)}
			offset={[0, 12]}
			target={targetRef}
			zIndex={akEditorFloatingDialogZIndex}
			fitHeight={390}
			fitWidth={340}
			mountTo={mountPoint}
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
						<Tabs id="media-insert-tab-navigation">
							<Box paddingBlockEnd="space.150">
								<TabList>
									{!isOnlyExternalLinks && (
										<Tab>{intl.formatMessage(mediaInsertMessages.fileTabTitle)}</Tab>
									)}
									<Tab>{intl.formatMessage(mediaInsertMessages.linkTabTitle)}</Tab>
								</TabList>
							</Box>
							{!isOnlyExternalLinks && (
								<CustomTabPanel>
									<LocalMedia
										ref={autofocusRef}
										mediaProvider={mediaProvider}
										closeMediaInsertPicker={() => {
											closeMediaInsertPicker();
											focusEditor();
										}}
										dispatchAnalyticsEvent={dispatchAnalyticsEvent}
										insertFile={insertFile}
									/>
								</CustomTabPanel>
							)}
							<CustomTabPanel>
								{fg('platform_editor_media_from_url_remove_form') ? (
									<MediaFromURL
										mediaProvider={mediaProvider}
										dispatchAnalyticsEvent={dispatchAnalyticsEvent}
										closeMediaInsertPicker={() => {
											closeMediaInsertPicker();
											focusEditor();
										}}
										insertMediaSingle={insertMediaSingle}
										insertExternalMediaSingle={insertExternalMediaSingle}
										isOnlyExternalLinks={isOnlyExternalLinks}
									/>
								) : (
									<MediaFromURLWithForm
										mediaProvider={mediaProvider}
										dispatchAnalyticsEvent={dispatchAnalyticsEvent}
										closeMediaInsertPicker={() => {
											closeMediaInsertPicker();
											focusEditor();
										}}
										insertMediaSingle={insertMediaSingle}
										insertExternalMediaSingle={insertExternalMediaSingle}
										isOnlyExternalLinks={isOnlyExternalLinks}
									/>
								)}
							</CustomTabPanel>
						</Tabs>
					</MediaInsertWrapper>
				)}
			</PlainOutsideClickTargetRefContext.Consumer>
		</PopupWithListeners>
	);
};
