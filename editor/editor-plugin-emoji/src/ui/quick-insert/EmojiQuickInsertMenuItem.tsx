import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import { messages as quickInsertMessages } from '@atlaskit/editor-common/quick-insert/messages';
import type { TypeAheadInsert } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import EmojiIcon from '@atlaskit/icon/core/emoji';

const previewImageUrls = {
	dark: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVH4.png',
	light: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVKH.png',
};
export const EmojiQuickInsertMenuItem = ({
	selectEmojiFromQuickInsert,
}: {
	selectEmojiFromQuickInsert: (insert: TypeAheadInsert) => Transaction;
}): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const preview = useMemo(
		() => ({
			image: previewImageUrls,
			attribution: { name: formatMessage(quickInsertMessages.previewAttributionAtlassian) },
		}),
		[formatMessage],
	);
	const onSelect = useCallback(
		({ insert }: OnSelectContext) => selectEmojiFromQuickInsert(insert),
		[selectEmojiFromQuickInsert],
	);

	return (
		<QuickInsertMenuItem
			description={formatMessage(messages.emojiDescription)}
			iconBefore={<EmojiIcon label="" />}
			onSelect={onSelect}
			preview={preview}
			shortcut=":"
			title={formatMessage(messages.emoji)}
		/>
	);
};
