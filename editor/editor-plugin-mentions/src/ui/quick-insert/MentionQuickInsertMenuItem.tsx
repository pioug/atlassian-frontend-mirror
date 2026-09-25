import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
	type QuickInsertMenuItemProps,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import { messages as quickInsertMessages } from '@atlaskit/editor-common/quick-insert/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { TypeAheadHandler } from '@atlaskit/editor-plugin-type-ahead';
import MentionIcon from '@atlaskit/icon/core/mention';

import type { MentionsPlugin } from '../../mentionsPluginType';
import { mentionPluginKey } from '../../pm-plugins/key';

type Props = {
	api: ExtractInjectionAPI<MentionsPlugin> | undefined;
	previewImageUrls?: QuickInsertMenuItemProps['previewImageUrls'];
	typeAhead: TypeAheadHandler;
};

export const MentionQuickInsertMenuItem = ({
	api,
	previewImageUrls,
	typeAhead,
}: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const preview = useMemo(
		() =>
			previewImageUrls
				? {
						image: previewImageUrls,
						attribution: {
							name: formatMessage(quickInsertMessages.previewAttributionAtlassian),
						},
					}
				: undefined,
		[formatMessage, previewImageUrls],
	);
	const onSelect = useCallback(
		({ editorView, insert }: OnSelectContext) => {
			if (mentionPluginKey.getState(editorView.state)?.canInsertMention === false) {
				return false;
			}

			const tr = insert(undefined);

			const didOpen = api?.typeAhead?.actions.openAtTransaction({
				triggerHandler: typeAhead,
				inputMethod: INPUT_METHOD.QUICK_INSERT,
			})(tr);
			if (didOpen === false) {
				return false;
			}
			return tr;
		},
		[api, typeAhead],
	);

	return (
		<QuickInsertMenuItem
			description={formatMessage(messages.mentionDescription)}
			iconBefore={<MentionIcon label="" />}
			onSelect={onSelect}
			preview={preview}
			shortcut="@"
			title={formatMessage(messages.mention)}
		/>
	);
};
