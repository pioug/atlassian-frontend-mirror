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

import { useFocusEditor } from '../hooks/use-focus-editor';
import { type MediaInsertPickerProps } from '../types';

import { MediaInsertContent } from './MediaInsertContent';
import { MediaInsertWrapper } from './MediaInsertWrapper';

const PopupWithListeners = withOuterListeners(Popup);

const getDomRefFromSelection = (
	view: EditorView,
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
) => {
	try {
		const domRef = findDomRefAtPos(view.state.selection.from, view.domAtPos.bind(view));
		if (domRef instanceof HTMLElement) {
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
}: MediaInsertPickerProps) => {
	const targetRef = getDomRefFromSelection(editorView, dispatchAnalyticsEvent);

	const isOpen = useSharedPluginState(api, ['mediaInsert'])?.mediaInsertState?.isOpen;
	const mediaProvider = useSharedPluginState(api, ['media'])?.mediaState?.mediaProvider;
	const intl = useIntl();
	const focusEditor = useFocusEditor({ editorView });

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
			mountTo={popupsMountPoint}
			boundariesElement={popupsBoundariesElement}
			handleClickOutside={handleClose(INPUT_METHOD.MOUSE)}
			handleEscapeKeydown={handleClose(INPUT_METHOD.KEYBOARD)}
			scrollableElement={popupsScrollableElement}
			preventOverflow={true}
			focusTrap
		>
			<MediaInsertWrapper>
				<MediaInsertContent
					mediaProvider={mediaProvider}
					dispatchAnalyticsEvent={dispatchAnalyticsEvent}
					closeMediaInsertPicker={() => {
						closeMediaInsertPicker();
						focusEditor();
					}}
					insertMediaSingle={insertMediaSingle}
					insertExternalMediaSingle={insertExternalMediaSingle}
				/>
			</MediaInsertWrapper>
		</PopupWithListeners>
	);
};
