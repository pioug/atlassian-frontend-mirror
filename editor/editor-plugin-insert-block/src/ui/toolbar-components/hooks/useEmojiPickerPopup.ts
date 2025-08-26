import { useCallback } from 'react';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EmojiId } from '@atlaskit/emoji/types';

import type { InsertBlockPlugin } from '../../../insertBlockPluginType';

import { usePopupManager } from './usePopupManager';

interface UseEmojiPickerPopupProps {
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
	buttonRef: React.RefObject<HTMLElement>;
}

export const useEmojiPickerPopup = ({ api, buttonRef }: UseEmojiPickerPopupProps) => {
	const popupManager = usePopupManager({
		focusTarget: buttonRef,
		analytics: {
			onToggle: (isOpen) => {
				if (isOpen) {
					api?.analytics?.actions.fireAnalyticsEvent({
						action: ACTION.OPENED,
						actionSubject: ACTION_SUBJECT.PICKER,
						actionSubjectId: ACTION_SUBJECT_ID.PICKER_EMOJI,
						attributes: { inputMethod: INPUT_METHOD.TOOLBAR },
						eventType: EVENT_TYPE.UI,
					});
				}
			},
		},
	});

	const handleSelectedEmoji = useCallback(
		(emojiId: EmojiId) => {
			api?.core.actions.focus();
			api?.core.actions.execute(api?.emoji?.commands.insertEmoji(emojiId, INPUT_METHOD.PICKER));
			popupManager.close();
			return true;
		},
		[api, popupManager],
	);

	const onPopupUnmount = useCallback(() => {
		requestAnimationFrame(() => api?.core.actions.focus());
	}, [api]);

	return {
		...popupManager,
		handleSelectedEmoji,
		onPopupUnmount,
	};
};
