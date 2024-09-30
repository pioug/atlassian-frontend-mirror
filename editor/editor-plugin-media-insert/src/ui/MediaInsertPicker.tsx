import React from 'react';

import { useIntl } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type {
	AnalyticsEventPayload,
	DispatchAnalyticsEvent,
} from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { mediaInsertMessages } from '@atlaskit/editor-common/messages';
import { Popup, withOuterListeners } from '@atlaskit/editor-common/ui';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles';
import { Box } from '@atlaskit/primitives';
import Tabs, { Tab, TabList, useTabPanel } from '@atlaskit/tabs';

import { useFocusEditor } from '../hooks/use-focus-editor';
import { useUnholyAutofocus } from '../hooks/use-unholy-autofocus';
import { type MediaInsertPickerProps } from '../types';

import { LocalMedia } from './LocalMedia';
import { MediaFromURL } from './MediaFromURL';
import { MediaInsertWrapper } from './MediaInsertWrapper';

const PopupWithListeners = withOuterListeners(Popup);

const getDomRefFromSelection = (
	view: EditorView,
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
) => {
	try {
		const domRef = findDomRefAtPos(view.state.selection.from, view.domAtPos.bind(view));
		if (domRef instanceof HTMLElement) {
			// If element is not a paragraph, we need to find the closest paragraph parent
			if (domRef.nodeName !== 'P') {
				const paragraphRef = domRef.closest('p');
				if (paragraphRef) {
					return paragraphRef;
				}
			}
			return domRef;
		} else {
			throw new Error('Invalid DOM reference');
		}
	} catch (error: unknown) {
		if (dispatchAnalyticsEvent) {
			const payload: AnalyticsEventPayload = {
				action: ACTION.ERRORED,
				actionSubject: ACTION_SUBJECT.PICKER,
				actionSubjectId: ACTION_SUBJECT_ID.PICKER_MEDIA,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: {
					error: 'Error getting DOM reference from selection',
				},
			};
			dispatchAnalyticsEvent(payload);
		}
	}
};

/**
 * A custom TabPanel that is non-focusable.
 */
const CustomTabPanel = ({ children }: { children: React.ReactNode }) => {
	const tabPanelAttributes = useTabPanel();
	return (
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
}: MediaInsertPickerProps) => {
	const { isOpen, target } = useSharedPluginState(api, ['mediaInsert'])?.mediaInsertState ?? {};

	// If targetRef is undefined, target the selection in the editor
	const targetRef = target ?? getDomRefFromSelection(editorView, dispatchAnalyticsEvent);

	const mediaProvider = useSharedPluginState(api, ['media'])?.mediaState?.mediaProvider;
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
			target={target ?? targetRef}
			zIndex={akEditorFloatingDialogZIndex}
			fitHeight={390}
			fitWidth={340}
			mountTo={popupsMountPoint}
			boundariesElement={popupsBoundariesElement}
			handleClickOutside={handleClose(INPUT_METHOD.MOUSE)}
			handleEscapeKeydown={handleClose(INPUT_METHOD.KEYBOARD)}
			scrollableElement={popupsScrollableElement}
			preventOverflow={true}
			onPositionCalculated={onPositionCalculated}
			focusTrap
		>
			<MediaInsertWrapper>
				<Tabs id="media-insert-tab-navigation">
					<Box paddingBlockEnd="space.150">
						<TabList>
							<Tab>{intl.formatMessage(mediaInsertMessages.fileTabTitle)}</Tab>
							<Tab>{intl.formatMessage(mediaInsertMessages.linkTabTitle)}</Tab>
						</TabList>
					</Box>
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
					<CustomTabPanel>
						<MediaFromURL
							mediaProvider={mediaProvider}
							dispatchAnalyticsEvent={dispatchAnalyticsEvent}
							closeMediaInsertPicker={() => {
								closeMediaInsertPicker();
								focusEditor();
							}}
							insertMediaSingle={insertMediaSingle}
							insertExternalMediaSingle={insertExternalMediaSingle}
						/>
					</CustomTabPanel>
				</Tabs>
			</MediaInsertWrapper>
		</PopupWithListeners>
	);
};
