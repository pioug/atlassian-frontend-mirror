import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import EmojiIcon from '@atlaskit/icon/core/emoji';

import { setInlineEmojiPopupOpen } from '../../pm-plugins/actions';

export const EmojiQuickInsertMenuItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const onSelect = useCallback(
		({ insert }: OnSelectContext) => setInlineEmojiPopupOpen(true)(insert('')),
		[],
	);

	return (
		<QuickInsertMenuItem
			iconBefore={<EmojiIcon label="" />}
			onSelect={onSelect}
			shortcut=":"
			title={formatMessage(messages.emoji)}
		/>
	);
};
