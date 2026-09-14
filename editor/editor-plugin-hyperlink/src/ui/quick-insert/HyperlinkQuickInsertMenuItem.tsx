import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { addLink, tooltip } from '@atlaskit/editor-common/keymaps';
import { LinkAction } from '@atlaskit/editor-common/link';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import LinkIcon from '@atlaskit/icon/core/link';

import type { HyperlinkPlugin } from '../../hyperlinkPluginType';
import { stateKey } from '../../pm-plugins/main';

export const HyperlinkQuickInsertMenuItem = ({
	api,
}: {
	api: ExtractInjectionAPI<HyperlinkPlugin> | undefined;
}): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const onSelect = useCallback(
		({ insert }: OnSelectContext) => {
			const tr = insert(undefined);
			tr.setMeta(stateKey, {
				type: LinkAction.SHOW_INSERT_TOOLBAR,
				inputMethod: INPUT_METHOD.QUICK_INSERT,
			});
			const analyticsAttached = api?.analytics?.actions?.attachAnalyticsEvent?.({
				action: ACTION.INVOKED,
				actionSubject: ACTION_SUBJECT.TYPEAHEAD,
				actionSubjectId: ACTION_SUBJECT_ID.TYPEAHEAD_LINK,
				attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
				eventType: EVENT_TYPE.UI,
			})(tr);
			return analyticsAttached !== false ? tr : false;
		},
		[api],
	);

	return (
		<QuickInsertMenuItem
			iconBefore={<LinkIcon label="" />}
			onSelect={onSelect}
			shortcut={tooltip(addLink)}
			title={formatMessage(messages.link)}
		/>
	);
};
