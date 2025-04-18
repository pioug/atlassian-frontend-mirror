import React, { useCallback, useState } from 'react';

import { type OnEmojiEvent } from '@atlaskit/emoji/types';
import { EmojiPicker } from '@atlaskit/emoji/picker';
import Popup from '@atlaskit/popup';

import { PickerRender } from '../ufo';
import { Trigger } from './Trigger';
import { type ReactionPickerProps } from './ReactionPicker';

interface ReactionSummaryViewEmojiPickerProps extends ReactionPickerProps {}

export const ReactionSummaryViewEmojiPicker = ({
	emojiProvider,
	onSelection,
	emojiPickerSize,
	disabled,
	reactionPickerTriggerIcon,
	tooltipContent,
	onOpen,
	reactionPickerTriggerText,
}: ReactionSummaryViewEmojiPickerProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleClick = () => {
		// ufo start reactions picker open experience
		PickerRender.start();

		setIsOpen((prevIsOpen) => !prevIsOpen);
		onOpen && onOpen();

		// ufo reactions picker opened success
		PickerRender.success();
	};

	/**
	 * Event callback when the picker is closed
	 * @param _id Optional id if an emoji button was selected or undefined if was clicked outside the picker
	 */
	const close = useCallback(
		(_id?: string) => {
			setIsOpen(false);
			// ufo abort reaction experience
			PickerRender.abort({
				metadata: {
					emojiId: _id,
					source: 'ReactionPicker',
					reason: 'close dialog',
				},
			});
		},
		[setIsOpen],
	);

	/**
	 * Event callback when an emoji icon is selected
	 * @param item selected item
	 */
	const onEmojiSelected: OnEmojiEvent = useCallback(
		(item) => {
			// no emoji was selected
			if (!item.id) {
				return;
			}
			onSelection(item.id, 'emojiPicker');
			close(item.id);
		},
		[onSelection, close],
	);

	return (
		<Popup
			testId="reaction-summary-view-emoji-picker"
			isOpen={isOpen}
			placement="bottom-start"
			offset={[-10, -66]}
			onClose={() => close()}
			content={() => (
				<EmojiPicker
					emojiProvider={emojiProvider}
					onSelection={onEmojiSelected}
					size={emojiPickerSize}
				/>
			)}
			trigger={(triggerProps) => (
				<Trigger
					{...triggerProps}
					disabled={disabled}
					reactionPickerTriggerIcon={reactionPickerTriggerIcon}
					tooltipContent={tooltipContent}
					onClick={handleClick}
					showAddReactionText
					reactionPickerTriggerText={reactionPickerTriggerText}
					fullWidthSummaryViewReactionPickerTrigger
				/>
			)}
		/>
	);
};
