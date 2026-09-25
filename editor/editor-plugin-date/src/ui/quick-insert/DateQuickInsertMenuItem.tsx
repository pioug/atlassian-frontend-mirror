import React, { useCallback, useMemo } from 'react';

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
	type QuickInsertMenuItemProps,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import { messages as quickInsertMessages } from '@atlaskit/editor-common/quick-insert/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import CalendarIcon from '@atlaskit/icon/core/calendar';

import type { DatePlugin } from '../../datePluginType';
import { createDateAtTransaction } from '../../pm-plugins/actions';

export const DateQuickInsertMenuItem = ({
	api,
	previewImageUrls,
}: {
	api: ExtractInjectionAPI<DatePlugin> | undefined;
	previewImageUrls?: QuickInsertMenuItemProps['previewImageUrls'];
}): React.JSX.Element => {
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
			description={formatMessage(messages.dateDescription)}
			iconBefore={<CalendarIcon label="" />}
			onSelect={onSelect}
			preview={preview}
			shortcut="//"
			title={formatMessage(messages.date)}
		/>
	);
};
