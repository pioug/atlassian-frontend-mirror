import React, { useCallback, useMemo } from 'react';

import type { MessageDescriptor } from 'react-intl';
import { useIntl } from 'react-intl';

import { PanelType, type PanelAttributes } from '@atlaskit/adf-schema/panel';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
	type QuickInsertMenuItemProps,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import { messages as quickInsertMessages } from '@atlaskit/editor-common/quick-insert/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { PanelPlugin } from '../../panelPluginType';
import { createPanelAction } from '../../pm-plugins/commands/create-panel-action';

export type QuickInsertPanelType = Exclude<PanelType, PanelType.TIP>;

const getPanelAttributes = (panelType: QuickInsertPanelType): PanelAttributes =>
	panelType === PanelType.CUSTOM
		? {
				panelType,
				panelIcon: ':rainbow:',
				panelIconId: '1f308',
				panelIconText: '🌈',
				// Custom panel color is stored in ADF, not applied as UI styling.
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
				panelColor: '#E6FCFF',
			}
		: { panelType };

export const PanelQuickInsertMenuItem = ({
	api,
	description,
	icon: Icon,
	panelType,
	previewImageUrls,
	title,
}: {
	api: ExtractInjectionAPI<PanelPlugin> | undefined;
	description: MessageDescriptor;
	icon: React.ComponentType<{ label: string }>;
	panelType: QuickInsertPanelType;
	previewImageUrls?: QuickInsertMenuItemProps['previewImageUrls'];
	title: MessageDescriptor;
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
		({ editorView, insert, source }: OnSelectContext) =>
			createPanelAction({
				api,
				attributes: getPanelAttributes(panelType),
				inputMethod: source,
				state: editorView.state,
				typeAheadInsert: insert,
			}),
		[api, panelType],
	);

	return (
		<QuickInsertMenuItem
			description={formatMessage(description)}
			iconBefore={<Icon label="" />}
			onSelect={onSelect}
			preview={preview}
			title={formatMessage(title)}
		/>
	);
};
