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
import CalendarIcon from '@atlaskit/icon/core/calendar';

import type { DatePlugin } from '../../datePluginType';
import { createDateAtTransaction } from '../../pm-plugins/actions';

export const DateQuickInsertMenuItem = ({
	api,
}: {
	api: ExtractInjectionAPI<DatePlugin> | undefined;
}): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const onSelect = useCallback(
		({ insert, source }: OnSelectContext) => {
			const tr = createDateAtTransaction(true)(insert(undefined));
			api?.analytics?.actions?.attachAnalyticsEvent?.({
				action: ACTION.INSERTED,
				actionSubject: ACTION_SUBJECT.DOCUMENT,
				actionSubjectId: ACTION_SUBJECT_ID.DATE,
				attributes: { inputMethod: source ?? INPUT_METHOD.QUICK_INSERT },
				eventType: EVENT_TYPE.TRACK,
			})(tr);
			return tr;
		},
		[api],
	);

	return (
		<QuickInsertMenuItem
			iconBefore={<CalendarIcon label="" />}
			onSelect={onSelect}
			shortcut="//"
			title={formatMessage(messages.date)}
		/>
	);
};
