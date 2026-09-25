import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { toggleBulletList, toggleOrderedList, tooltip } from '@atlaskit/editor-common/keymaps';
import { listMessages as messages } from '@atlaskit/editor-common/messages';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import { messages as quickInsertMessages } from '@atlaskit/editor-common/quick-insert/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import ListBulletedIcon from '@atlaskit/icon/core/list-bulleted';
import ListNumberedIcon from '@atlaskit/icon/core/list-numbered';

import type { ListPlugin } from '../../listPluginType';

type Props = {
	api: ExtractInjectionAPI<ListPlugin> | undefined;
	type: 'ordered' | 'unordered';
};

const previewImageUrls: Record<Props['type'], { dark: string; light: string }> = {
	ordered: {
		dark: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVHU.png',
		light: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVLU.png',
	},
	unordered: {
		dark: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVHR.png',
		light: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVMP.png',
	},
};

export const ListQuickInsertMenuItem = ({ api, type }: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const isOrdered = type === 'ordered';
	const preview = useMemo(
		() => ({
			image: previewImageUrls[type],
			attribution: { name: formatMessage(quickInsertMessages.previewAttributionAtlassian) },
		}),
		[formatMessage, type],
	);
	const onSelect = useCallback(
		({ editorView, insert, source }: OnSelectContext) => {
			const { schema } = editorView.state;
			const listNode = isOrdered ? schema.nodes.orderedList : schema.nodes.bulletList;
			const actionSubjectId = isOrdered
				? ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER
				: ACTION_SUBJECT_ID.FORMAT_LIST_BULLET;
			const tr = insert(
				listNode.createChecked(
					{},
					schema.nodes.listItem.createChecked({}, schema.nodes.paragraph.createChecked()),
				),
			);
			api?.analytics?.actions.attachAnalyticsEvent({
				action: ACTION.INSERTED,
				actionSubject: ACTION_SUBJECT.LIST,
				actionSubjectId,
				attributes: { inputMethod: source },
				eventType: EVENT_TYPE.TRACK,
			})(tr);
			return tr;
		},
		[api, isOrdered],
	);

	return (
		<QuickInsertMenuItem
			description={formatMessage(
				isOrdered ? messages.orderedListDescription : messages.unorderedListDescription,
			)}
			iconBefore={isOrdered ? <ListNumberedIcon label="" /> : <ListBulletedIcon label="" />}
			onSelect={onSelect}
			preview={preview}
			shortcut={tooltip(isOrdered ? toggleOrderedList : toggleBulletList)}
			title={formatMessage(isOrdered ? messages.orderedList : messages.unorderedList)}
		/>
	);
};
