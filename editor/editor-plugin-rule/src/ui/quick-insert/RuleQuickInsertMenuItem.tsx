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
import MinusIcon from '@atlaskit/icon/core/minus';

import type { RulePlugin } from '../../rulePluginType';

export const RuleQuickInsertMenuItem = ({
	api,
}: {
	api: ExtractInjectionAPI<RulePlugin> | undefined;
}): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const onSelect = useCallback(
		({ editorView, insert, source }: OnSelectContext) => {
			const tr = insert(editorView.state.schema.nodes.rule.createChecked());
			api?.analytics?.actions.attachAnalyticsEvent({
				action: ACTION.INSERTED,
				actionSubject: ACTION_SUBJECT.DOCUMENT,
				actionSubjectId: ACTION_SUBJECT_ID.DIVIDER,
				attributes: { inputMethod: source ?? INPUT_METHOD.QUICK_INSERT },
				eventType: EVENT_TYPE.TRACK,
			})(tr);
			return tr;
		},
		[api],
	);

	return (
		<QuickInsertMenuItem
			iconBefore={<MinusIcon label="" />}
			onSelect={onSelect}
			shortcut="---"
			title={formatMessage(messages.horizontalRule)}
		/>
	);
};
