import React, { useRef, useState } from 'react';

import { useIntl } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import {
	OutsideClickTargetRefContext,
	withReactEditorViewOuterListeners as withOuterListeners,
} from '@atlaskit/editor-common/ui-react';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import { ToolbarButton, ToolbarTooltip, EmojiIcon } from '@atlaskit/editor-toolbar';
import type { EmojiId } from '@atlaskit/emoji';
import { EmojiPicker as AkEmojiPicker } from '@atlaskit/emoji/picker';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { InsertBlockPlugin } from '../../insertBlockPluginType';

import { isDetachedElement } from './utils/utils';

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

type EmojiButtonProps = {
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
};

export const EmojiButton = ({ api }: EmojiButtonProps) => {
	const { formatMessage } = useIntl();
	const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

	const emojiButtonRef = useRef<HTMLButtonElement | null>(null);

	const { emojiProviderSelector, emojiProviderPromise, isTypeAheadAllowed } =
		useSharedPluginStateWithSelector(api, ['emoji', 'typeAhead'], (states) => ({
			emojiProviderSelector: states.emojiState?.emojiProvider,
			emojiProviderPromise: states.emojiState?.emojiProviderPromise,
			isTypeAheadAllowed: states.typeAheadState?.isAllowed,
		}));

	if (!api?.emoji) {
		return null;
	}

	const toggleEmojiPickerOpen = (newState: boolean) => {
		const oldState = emojiPickerOpen;
		if (newState === true && oldState === false) {
			api?.analytics?.actions.fireAnalyticsEvent({
				action: ACTION.OPENED,
				actionSubject: ACTION_SUBJECT.PICKER,
				actionSubjectId: ACTION_SUBJECT_ID.PICKER_EMOJI,
				attributes: { inputMethod: INPUT_METHOD.TOOLBAR },
				eventType: EVENT_TYPE.UI,
			});
		}
		setEmojiPickerOpen(newState);
	};

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

	const onPopupUnmount = () => {
		requestAnimationFrame(() => api?.core.actions.focus());
	};

	const handleSelectedEmoji = (emojiId: EmojiId) => {
		api?.core.actions.focus();
		api?.core.actions.execute(api?.emoji?.commands.insertEmoji(emojiId, INPUT_METHOD.PICKER));
		toggleEmojiPickerOpen(false);
		return true;
	};

	const handleEmojiClickOutside = (e: MouseEvent) => {
		// Ignore click events for detached elements.
		// Workaround for FS-1322 - where two onClicks fire - one when the upload button is
		// still in the document, and one once it's detached. Does not always occur, and
		// may be a side effect of a react render optimisation
		if (e.target instanceof HTMLElement && !isDetachedElement(e.target)) {
			toggleEmojiPickerOpen(false);
		}
	};

	const handleEmojiPressEscape = () => {
		toggleEmojiPickerOpen(false);
		emojiButtonRef?.current?.focus();
	};

	const onClick = () => {
		toggleEmojiPickerOpen(!emojiPickerOpen);
	};

	return (
		<>
			{emojiPickerOpen && emojiButtonRef.current && emojiProvider && (
				<Popup
					target={emojiButtonRef.current}
					fitHeight={350}
					fitWidth={350}
					offset={[0, 3]}
					mountTo={emojiButtonRef.current}
					onUnmount={onPopupUnmount}
					focusTrap
					zIndex={akEditorMenuZIndex}
				>
					<EmojiPickerWithListeners
						emojiProvider={emojiProvider}
						onSelection={handleSelectedEmoji}
						handleClickOutside={handleEmojiClickOutside}
						handleEscapeKeydown={handleEmojiPressEscape}
					/>
				</Popup>
			)}
			<ToolbarTooltip content={formatMessage(messages.emoji)}>
				<ToolbarButton
					iconBefore={<EmojiIcon label={formatMessage(messages.emoji)} size="small" />}
					ariaKeyshortcuts="Shift+;"
					ref={emojiButtonRef}
					onClick={onClick}
					isSelected={emojiPickerOpen}
					isDisabled={!isTypeAheadAllowed || !emojiProvider}
				/>
			</ToolbarTooltip>
		</>
	);
};
