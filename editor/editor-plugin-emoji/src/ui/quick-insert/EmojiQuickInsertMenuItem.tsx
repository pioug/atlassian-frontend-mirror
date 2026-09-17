import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import EmojiIcon from '@atlaskit/icon/core/emoji';

import { setInlineEmojiPopupOpen } from '../../pm-plugins/actions';

const previewImageUrls = {
	dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/4jp3h212r4t8s51s7pv58v63gq23lbff.png',
	light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/j6cr4usu4q8iqwlf00157vf6724k1ki7.png',
};

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
			previewImageUrls={previewImageUrls}
			shortcut=":"
			title={formatMessage(messages.emoji)}
		/>
	);
};
