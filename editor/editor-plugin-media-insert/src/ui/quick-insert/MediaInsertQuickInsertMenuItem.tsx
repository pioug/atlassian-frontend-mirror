import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
	MEDIA_INSERT_TAB,
} from '@atlaskit/editor-common/analytics';
import {
	DEFAULT_MEDIA_INSERT_TAB_RANK,
	MEDIA_INSERT_TAB_RANK,
} from '@atlaskit/editor-common/media-insert/rank';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import { messages as quickInsertMessages } from '@atlaskit/editor-common/quick-insert/messages';
import { useQuickInsertContext } from '@atlaskit/editor-common/quick-insert/use-quick-insert-context';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import ImageIcon from '@atlaskit/icon/core/image';

import type {
	MediaInsertPlugin,
	MediaInsertPluginConfig,
	RegisterInsertTab,
} from '../../mediaInsertPluginType';

type Props = {
	api: ExtractInjectionAPI<MediaInsertPlugin> | undefined;
	config: MediaInsertPluginConfig | undefined;
};

const previewImageUrls = {
	dark: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVK4.png',
	light: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVNH.png',
};

export const MediaInsertQuickInsertMenuItem = ({ api, config }: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const { isOffline } = useQuickInsertContext();
	const preview = useMemo(
		() => ({
			image: previewImageUrls,
			attribution: { name: formatMessage(quickInsertMessages.previewAttributionAtlassian) },
		}),
		[formatMessage],
	);
	const onSelect = useCallback(
		({ insert }: OnSelectContext) => {
			const tr = insert('');
			api?.mediaInsert?.commands.showMediaInsertPopup()({ tr });
			const initialBuiltInTab = config?.isOnlyExternalLinks
				? MEDIA_INSERT_TAB.LINK
				: MEDIA_INSERT_TAB.UPLOAD;
			const initialBuiltInRank = config?.isOnlyExternalLinks
				? MEDIA_INSERT_TAB_RANK[MEDIA_INSERT_TAB.LINK]
				: MEDIA_INSERT_TAB_RANK[MEDIA_INSERT_TAB.UPLOAD];
			const firstRegisteredTab = api?.mediaInsert?.actions
				.getInsertTabs()
				.reduce<RegisterInsertTab | undefined>(
					(firstTab, tab) =>
						!firstTab ||
						(tab.rank ?? DEFAULT_MEDIA_INSERT_TAB_RANK) <
							(firstTab.rank ?? DEFAULT_MEDIA_INSERT_TAB_RANK)
							? tab
							: firstTab,
					undefined,
				);
			api?.analytics?.actions?.attachAnalyticsEvent({
				action: ACTION.OPENED,
				actionSubject: ACTION_SUBJECT.PICKER,
				actionSubjectId: ACTION_SUBJECT_ID.PICKER_MEDIA,
				attributes: {
					inputMethod: INPUT_METHOD.QUICK_INSERT,
					openedTab:
						firstRegisteredTab &&
						(firstRegisteredTab.rank ?? DEFAULT_MEDIA_INSERT_TAB_RANK) < initialBuiltInRank
							? (firstRegisteredTab.key as MEDIA_INSERT_TAB)
							: initialBuiltInTab,
				},
				eventType: EVENT_TYPE.UI,
			})(tr);
			return tr;
		},
		[api, config],
	);

	return (
		<QuickInsertMenuItem
			description={formatMessage(messages.mediaFilesDescription)}
			iconBefore={<ImageIcon label="" />}
			isDisabled={isOffline}
			onSelect={onSelect}
			preview={preview}
			title={formatMessage(messages.mediaFiles)}
		/>
	);
};
