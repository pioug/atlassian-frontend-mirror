import React, { useRef } from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { ToolbarButton, ToolbarTooltip, EmojiIcon } from '@atlaskit/editor-toolbar';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { useEmojiPickerPopup } from './hooks/useEmojiPickerPopup';
import { EmojiPickerPopup } from './popups/EmojiPickerPopup';
import type { BaseToolbarButtonProps } from './shared/types';

export const EmojiButton = ({
	api,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement
}: BaseToolbarButtonProps) => {
	const { formatMessage } = useIntl();
	const emojiButtonRef = useRef<HTMLButtonElement | null>(null);

	const { emojiProviderSelector, emojiProviderPromise, isTypeAheadAllowed } =
		useSharedPluginStateWithSelector(api, ['emoji', 'typeAhead'], (states) => ({
			emojiProviderSelector: states.emojiState?.emojiProvider,
			emojiProviderPromise: states.emojiState?.emojiProviderPromise,
			isTypeAheadAllowed: states.typeAheadState?.isAllowed,
		}));

	const emojiPickerPopup = useEmojiPickerPopup({
		api,
		buttonRef: emojiButtonRef,
	});

	if (!api?.emoji) {
		return null;
	}

	const getEmojiProvider = () => {
		if (emojiProviderSelector) {
			return Promise.resolve(emojiProviderSelector);
		}
	};

	const emojiProvider = expValEquals(
		'platform_editor_prevent_toolbar_layout_shifts',
		'isEnabled',
		true,
	)
		? emojiProviderPromise
		: getEmojiProvider();

	return (
		<>
			<EmojiPickerPopup
				isOpen={emojiPickerPopup.isOpen}
				targetRef={emojiButtonRef}
				emojiProvider={emojiProvider}
				onSelection={emojiPickerPopup.handleSelectedEmoji}
				onClickOutside={emojiPickerPopup.handleClickOutside}
				onEscapeKeydown={emojiPickerPopup.handleEscapeKeydown}
				onUnmount={emojiPickerPopup.onPopupUnmount}
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsScrollableElement={popupsScrollableElement}
			/>
			<ToolbarTooltip content={formatMessage(messages.emoji)}>
				<ToolbarButton
					iconBefore={<EmojiIcon label={formatMessage(messages.emoji)} size="small" />}
					ariaKeyshortcuts="Shift+;"
					ref={emojiButtonRef}
					onClick={() => emojiPickerPopup.toggle()}
					isSelected={emojiPickerPopup.isOpen}
					isDisabled={!isTypeAheadAllowed || !emojiProvider}
				/>
			</ToolbarTooltip>
		</>
	);
};
