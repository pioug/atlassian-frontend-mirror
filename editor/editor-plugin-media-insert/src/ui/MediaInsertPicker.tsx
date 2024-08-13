import React from 'react';

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
import { Popup, withOuterListeners } from '@atlaskit/editor-common/ui';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles';

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
}: MediaInsertPickerProps) => {
	const targetRef = getDomRefFromSelection(editorView, dispatchAnalyticsEvent);

	const { mediaInsertState } = useSharedPluginState(api, ['mediaInsert']);

	if (!mediaInsertState || !mediaInsertState.isOpen) {
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
		};

	return (
		<PopupWithListeners
			// TODO: i18n
			ariaLabel={'Media Insert'}
			offset={[0, 12]}
			target={targetRef}
			zIndex={akEditorFloatingDialogZIndex}
			mountTo={popupsMountPoint}
			boundariesElement={popupsBoundariesElement}
			handleClickOutside={handleClose(INPUT_METHOD.MOUSE)}
			handleEscapeKeydown={handleClose(INPUT_METHOD.KEYBOARD)}
			scrollableElement={popupsScrollableElement}
			focusTrap
		>
			<MediaInsertWrapper>
				<MediaInsertContent />
			</MediaInsertWrapper>
		</PopupWithListeners>
	);
};
