import React, { useCallback } from 'react';

import type { MessageDescriptor } from 'react-intl';
import { useIntl } from 'react-intl';

import { PanelType, type PanelAttributes } from '@atlaskit/adf-schema/panel';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
} from '@atlaskit/editor-common/quick-insert/menu-item';
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
	icon: Icon,
	panelType,
	title,
}: {
	api: ExtractInjectionAPI<PanelPlugin> | undefined;
	icon: React.ComponentType<{ label: string }>;
	panelType: QuickInsertPanelType;
	title: MessageDescriptor;
}): React.JSX.Element => {
	const { formatMessage } = useIntl();
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
			iconBefore={<Icon label="" />}
			onSelect={onSelect}
			title={formatMessage(title)}
		/>
	);
};
