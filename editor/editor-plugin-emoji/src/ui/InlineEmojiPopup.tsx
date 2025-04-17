import React, { useCallback, useEffect } from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI, UiComponentFactoryParams } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import {
	OutsideClickTargetRefContext,
	withReactEditorViewOuterListeners as withOuterListeners,
} from '@atlaskit/editor-common/ui-react';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles';
import { type EmojiId, EmojiPicker } from '@atlaskit/emoji';
import { fg } from '@atlaskit/platform-feature-flags';

import { type EmojiPlugin } from '../emojiPluginType';

const PopupWithListeners = withOuterListeners(Popup);

const getDomRefFromSelection = (view: EditorView) => {
	const domRef = findDomRefAtPos(view.state.selection.from, view.domAtPos.bind(view));
	if (domRef instanceof HTMLElement) {
		if (domRef.nodeName !== 'P') {
			const paragraphRef = domRef.closest('p');
			if (paragraphRef) {
				return paragraphRef;
			}
		}

		return domRef;
	}

	throw new Error('Invalid DOM reference');
};

const emojiPopupMessages = {
	emojiPickerAriaLabel: {
		id: 'fabric.emoji.picker.aria.label',
		defaultMessage: 'Emoji picker',
		description: 'Accessible label for the emoji picker popup',
	},
};

type InlineEmojiPopupProps = Pick<
	UiComponentFactoryParams,
	'popupsBoundariesElement' | 'popupsMountPoint' | 'popupsScrollableElement'
> & {
	api: ExtractInjectionAPI<EmojiPlugin>;
	editorView: EditorView;
	onClose: () => void;
};

export const InlineEmojiPopup = ({
	api,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	editorView,
	onClose,
}: InlineEmojiPopupProps) => {
	const { emojiProvider, inlineEmojiPopupOpen: isOpen } =
		useSharedPluginState(api, ['emoji'])?.emojiState ?? {};
	const intl = useIntl();

	const handleOnClose = useCallback(() => {
		if (fg('platform_editor_ease_of_use_metrics')) {
			api?.core.actions.execute(api?.metrics?.commands.startActiveSessionTimer());
		}
		onClose();
	}, [onClose, api]);

	useEffect(() => {
		if (isOpen && fg('platform_editor_ease_of_use_metrics')) {
			api?.core.actions.execute(
				api?.metrics?.commands.handleIntentToStartEdit({
					shouldStartTimer: false,
					shouldPersistActiveSession: true,
				}),
			);
		}
	}, [isOpen, api]);

	const focusEditor = useCallback(() => {
		// use requestAnimationFrame to run this async after the call
		requestAnimationFrame(() => editorView.focus());
	}, [editorView]);

	const handleSelection = useCallback(
		(emojiId: EmojiId) => {
			api.core.actions.execute(api.emoji.commands.insertEmoji(emojiId, INPUT_METHOD.PICKER));
			handleOnClose();
		},
		[api.core.actions, api.emoji.commands, handleOnClose],
	);

	if (!isOpen || !emojiProvider) {
		return null;
	}

	const domRef = getDomRefFromSelection(editorView);

	return (
		<PopupWithListeners
			ariaLabel={intl.formatMessage(emojiPopupMessages.emojiPickerAriaLabel)}
			offset={[0, 12]}
			mountTo={popupsMountPoint}
			boundariesElement={popupsBoundariesElement}
			scrollableElement={popupsScrollableElement}
			zIndex={akEditorFloatingDialogZIndex}
			fitHeight={350}
			fitWidth={350}
			target={domRef}
			onUnmount={focusEditor}
			focusTrap
			preventOverflow
			handleClickOutside={handleOnClose}
			handleEscapeKeydown={handleOnClose}
			captureClick
		>
			<OutsideClickTargetRefContext.Consumer>
				{(setOutsideClickTargetRef) => (
					<EmojiPicker
						emojiProvider={Promise.resolve(emojiProvider)}
						onPickerRef={setOutsideClickTargetRef}
						onSelection={handleSelection}
					/>
				)}
			</OutsideClickTargetRefContext.Consumer>
		</PopupWithListeners>
	);
};
