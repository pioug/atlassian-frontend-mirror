import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import TextIcon from '@atlaskit/icon/core/text';

import type { PlaceholderTextPlugin } from '../../placeholderTextPluginType';
import { pluginKey } from '../../pm-plugins/plugin-key';

export const PlaceholderTextQuickInsertMenuItem = ({
	api,
}: {
	api: ExtractInjectionAPI<PlaceholderTextPlugin> | undefined;
}): React.JSX.Element => {
	const { formatMessage } = useIntl();
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
			iconBefore={<TextIcon label="" />}
			onSelect={onSelect}
			title={formatMessage(messages.placeholderText)}
		/>
	);
};
