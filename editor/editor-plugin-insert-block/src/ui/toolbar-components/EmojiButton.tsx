import React, { useRef } from 'react';

import { useIntl } from 'react-intl';

import { ToolTipContent, insertEmoji } from '@atlaskit/editor-common/keymaps';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages/insert-block';
import { TOOLBAR_BUTTON_TEST_ID } from '@atlaskit/editor-common/toolbar/keys';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import { EmojiIcon } from '@atlaskit/editor-toolbar/emoji-icon';
import { ToolbarButton } from '@atlaskit/editor-toolbar/toolbar-button';
import { ToolbarTooltip } from '@atlaskit/editor-toolbar/toolbar-tooltip';
import { useToolbarUI } from '@atlaskit/editor-toolbar/ui-context';

import { useEmojiPickerPopup } from './hooks/useEmojiPickerPopup';
import { EmojiPickerPopup } from './popups/EmojiPickerPopup';
import type { BaseToolbarButtonProps } from './shared/types';

export const EmojiButton = ({ api }: BaseToolbarButtonProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const emojiButtonRef = useRef<HTMLButtonElement | null>(null);
	const { popupsMountPoint, popupsBoundariesElement, popupsScrollableElement } = useToolbarUI();

	const { contentId, emojiProviderPromise, isTypeAheadAllowed } = useSharedPluginStateWithSelector(
		api,
		['emoji', 'typeAhead'],
		(states) => ({
			contentId: states.emojiState?.contentId,
			emojiProviderPromise: states.emojiState?.emojiProviderPromise,
			isTypeAheadAllowed: states.typeAheadState?.isAllowed,
		}),
	);

	const emojiPickerPopup = useEmojiPickerPopup({
		api,
		buttonRef: emojiButtonRef,
	});

	if (!api?.emoji) {
		return null;
	}

	return (
		<>
			<EmojiPickerPopup
				contentId={contentId}
				isOpen={emojiPickerPopup.isOpen}
				targetRef={emojiButtonRef}
				emojiProvider={emojiProviderPromise}
				onSelection={emojiPickerPopup.handleSelectedEmoji}
				onClickOutside={emojiPickerPopup.handleClickOutside}
				onEscapeKeydown={emojiPickerPopup.handleEscapeKeydown}
				onUnmount={emojiPickerPopup.onPopupUnmount}
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsScrollableElement={popupsScrollableElement}
			/>
			<ToolbarTooltip
				content={
					<ToolTipContent description={formatMessage(messages.emoji)} keymap={insertEmoji} />
				}
			>
				<ToolbarButton
					iconBefore={<EmojiIcon label={formatMessage(messages.emoji)} size="small" />}
					ariaKeyshortcuts="Shift+;"
					ref={emojiButtonRef}
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
					onClick={() => emojiPickerPopup.toggle()}
					isSelected={emojiPickerPopup.isOpen}
					isDisabled={!isTypeAheadAllowed || !emojiProviderPromise}
					testId={TOOLBAR_BUTTON_TEST_ID.EMOJI}
				/>
			</ToolbarTooltip>
		</>
	);
};
