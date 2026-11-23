import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics/types/enums';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages/insert-block';
import { ConfluenceAttributionIcon } from '@atlaskit/editor-common/quick-insert/confluence-attribution-icon';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
	type QuickInsertMenuItemProps,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import { messages as quickInsertMessages } from '@atlaskit/editor-common/quick-insert/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import TextIcon from '@atlaskit/icon/core/text';

import type { PlaceholderTextPlugin } from '../../placeholderTextPluginType';
import { pluginKey } from '../../pm-plugins/plugin-key';

export const PlaceholderTextQuickInsertMenuItem = ({
	api,
	previewImageUrls,
}: {
	api: ExtractInjectionAPI<PlaceholderTextPlugin> | undefined;
	previewImageUrls: QuickInsertMenuItemProps['previewImageUrls'];
}): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const preview = useMemo(
		() => ({
			...(previewImageUrls && { image: previewImageUrls }),
			attribution: {
				icon: ConfluenceAttributionIcon,
				name: formatMessage(quickInsertMessages.previewAttributionConfluence),
			},
		}),
		[formatMessage, previewImageUrls],
	);
	const onSelect = useCallback(
		({ editorView }: OnSelectContext) => {
			const tr = editorView.state.tr;
			tr.setMeta(pluginKey, { showInsertPanelAt: tr.selection.anchor });
			api?.analytics?.actions.attachAnalyticsEvent({
				action: ACTION.INSERTED,
				actionSubject: ACTION_SUBJECT.DOCUMENT,
				actionSubjectId: ACTION_SUBJECT_ID.PLACEHOLDER_TEXT,
				attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
				eventType: EVENT_TYPE.TRACK,
			})(tr);
			return tr;
		},
		[api],
	);

	return (
		<QuickInsertMenuItem
			description={formatMessage(messages.placeholderTextDescription)}
			iconBefore={<TextIcon label="" />}
			onSelect={onSelect}
			preview={preview}
			title={formatMessage(messages.placeholderText)}
		/>
	);
};
