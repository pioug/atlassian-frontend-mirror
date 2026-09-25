import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages } from '@atlaskit/editor-common/messages';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
	type QuickInsertMenuItemProps,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import { messages as quickInsertMessages } from '@atlaskit/editor-common/quick-insert/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import LayoutFiveColumnsIcon from '@atlaskit/icon-lab/core/layout-five-columns';
import LayoutFourColumnsIcon from '@atlaskit/icon-lab/core/layout-four-columns';
import LayoutThreeColumnsIcon from '@atlaskit/icon/core/layout-three-columns';
import LayoutTwoColumnsIcon from '@atlaskit/icon/core/layout-two-columns';

import { selectIntoLayoutSection } from '../../layoutPlugin';
import type { LayoutPlugin } from '../../layoutPluginType';
import { createMultiColumnLayoutSection } from '../../pm-plugins/actions';

const icons = {
	2: LayoutTwoColumnsIcon,
	3: LayoutThreeColumnsIcon,
	4: LayoutFourColumnsIcon,
	5: LayoutFiveColumnsIcon,
} as const;

type Props = {
	api: ExtractInjectionAPI<LayoutPlugin> | undefined;
	columnCount: 2 | 3 | 4 | 5;
	previewImageUrls?: QuickInsertMenuItemProps['previewImageUrls'];
	title: MessageDescriptor;
};

export const LayoutQuickInsertMenuItem = ({
	api,
	columnCount,
	previewImageUrls,
	title,
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
	const Icon = icons[columnCount];
	const onSelect = useCallback(
		({ editorView, insert, source }: OnSelectContext) => {
			const tr = insert(createMultiColumnLayoutSection(editorView.state, columnCount));
			api?.analytics?.actions.attachAnalyticsEvent({
				action: ACTION.INSERTED,
				actionSubject: ACTION_SUBJECT.DOCUMENT,
				actionSubjectId: ACTION_SUBJECT_ID.LAYOUT,
				attributes: {
					columnCount,
					inputMethod: source,
				},
				eventType: EVENT_TYPE.TRACK,
			})(tr);
			selectIntoLayoutSection(tr);
			return tr;
		},
		[api, columnCount],
	);

	return (
		<QuickInsertMenuItem
			description={formatMessage(toolbarInsertBlockMessages.columnsDescriptionAdvancedLayout, {
				numberOfColumns: columnCount,
			})}
			iconBefore={<Icon label="" />}
			onSelect={onSelect}
			preview={preview}
			title={formatMessage(title)}
		/>
	);
};
