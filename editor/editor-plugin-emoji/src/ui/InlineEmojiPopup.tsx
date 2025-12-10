import React, { useCallback, useEffect, useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import { ACTION_SUBJECT_ID, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { getDomRefFromSelection } from '@atlaskit/editor-common/get-dom-ref-from-selection';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI, UiComponentFactoryParams } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import {
	OutsideClickTargetRefContext,
	withReactEditorViewOuterListeners as withOuterListeners,
} from '@atlaskit/editor-common/ui-react';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles';
import { type EmojiId, EmojiPicker } from '@atlaskit/emoji';
import { fg } from '@atlaskit/platform-feature-flags';

import { type EmojiPlugin } from '../emojiPluginType';
import { setInlineEmojiPopupOpen } from '../pm-plugins/actions';

const PopupWithListeners = withOuterListeners(Popup);

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
};

export const InlineEmojiPopupOld = ({
	api,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	editorView,
	onClose,
}: InlineEmojiPopupProps & { onClose: () => void }): React.JSX.Element | null => {
	const { emojiProvider, inlineEmojiPopupOpen: isOpen } =
		useSharedPluginState(api, ['emoji'])?.emojiState ?? {};

	const intl = useIntl();
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

	const handleOnClose = useCallback(() => {
		if (fg('platform_editor_ease_of_use_metrics')) {
			api?.core.actions.execute(api?.metrics?.commands.startActiveSessionTimer());
		}
		onClose?.();
	}, [onClose, api]);

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

	const domRef = getDomRefFromSelection(
		editorView,
		ACTION_SUBJECT_ID.PICKER_EMOJI,
		api?.analytics?.actions,
	);
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

const InlineEmojiPopupContent = ({
	api,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	editorView,
}: InlineEmojiPopupProps) => {
	const emojiProvider = useSharedPluginStateSelector(api, 'emoji.emojiProvider');
	const intl = useIntl();

	useEffect(() => {
		if (fg('platform_editor_ease_of_use_metrics')) {
			api?.core.actions.execute(
				api?.metrics?.commands.handleIntentToStartEdit({
					shouldStartTimer: false,
					shouldPersistActiveSession: true,
				}),
			);
		}
	}, [api?.core.actions, api?.metrics?.commands]);

	const handleOnClose = useCallback(() => {
		editorView.dispatch(setInlineEmojiPopupOpen(false)(editorView.state.tr));

		if (fg('platform_editor_ease_of_use_metrics')) {
			api?.core.actions.execute(api?.metrics?.commands.startActiveSessionTimer());
		}
	}, [editorView, api.core.actions, api.metrics?.commands]);

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

	const domRef = useMemo(
		() =>
			getDomRefFromSelection(editorView, ACTION_SUBJECT_ID.PICKER_EMOJI, api?.analytics?.actions),
		[editorView, api?.analytics?.actions],
	);

	if (!emojiProvider) {
		return null;
	}

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

export const InlineEmojiPopup = React.memo(
	({
		api,
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
		editorView,
	}: InlineEmojiPopupProps): React.JSX.Element | null => {
		const isOpen = useSharedPluginStateSelector(api, 'emoji.inlineEmojiPopupOpen');

		if (!isOpen) {
			return null;
		}

		return (
			<InlineEmojiPopupContent
				api={api}
				editorView={editorView}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsMountPoint={popupsMountPoint}
				popupsScrollableElement={popupsScrollableElement}
			/>
		);
	},
);
