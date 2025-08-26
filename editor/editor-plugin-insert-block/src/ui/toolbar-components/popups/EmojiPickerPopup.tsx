import React from 'react';

import { Popup } from '@atlaskit/editor-common/ui';
import {
	OutsideClickTargetRefContext,
	withReactEditorViewOuterListeners as withOuterListeners,
} from '@atlaskit/editor-common/ui-react';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import { EmojiPicker as AkEmojiPicker } from '@atlaskit/emoji/picker';
import type { EmojiId, EmojiProvider } from '@atlaskit/emoji/types';

type AkEmojiPickerProps = Parameters<typeof AkEmojiPicker>[0];

const EmojiPicker = (props: AkEmojiPickerProps) => {
	const setOutsideClickTargetRef = React.useContext(OutsideClickTargetRefContext);
	return (
		<AkEmojiPicker
			onPickerRef={setOutsideClickTargetRef}
			emojiProvider={props.emojiProvider}
			onSelection={props.onSelection}
		/>
	);
};

const EmojiPickerWithListeners = withOuterListeners(EmojiPicker);

interface EmojiPickerPopupProps {
	emojiProvider?: Promise<EmojiProvider>;
	isOpen: boolean;
	onClickOutside: (e: MouseEvent) => void;
	onEscapeKeydown: () => void;
	onSelection: (emojiId: EmojiId) => boolean;
	onUnmount: () => void;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	targetRef: React.RefObject<HTMLElement>;
}

export const EmojiPickerPopup = ({
	isOpen,
	targetRef,
	emojiProvider,
	onSelection,
	onClickOutside,
	onEscapeKeydown,
	onUnmount,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
}: EmojiPickerPopupProps) => {
	if (!isOpen || !targetRef.current || !emojiProvider) {
		return null;
	}

	return (
		<Popup
			target={targetRef.current}
			fitHeight={350}
			fitWidth={350}
			offset={[0, 3]}
			mountTo={popupsMountPoint}
			boundariesElement={popupsBoundariesElement}
			scrollableElement={popupsScrollableElement}
			onUnmount={onUnmount}
			focusTrap
			zIndex={akEditorMenuZIndex}
		>
			<EmojiPickerWithListeners
				emojiProvider={emojiProvider}
				onSelection={onSelection}
				handleClickOutside={onClickOutside}
				handleEscapeKeydown={onEscapeKeydown}
			/>
		</Popup>
	);
};
