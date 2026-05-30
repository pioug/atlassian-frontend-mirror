import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import InformationCircleIcon from '@atlaskit/icon/core/information-circle';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { PanelPlugin } from '../panelPluginType';
import { pickPanelTypeForInsertion } from '../pm-plugins/utils/utils';

type Props = {
	api: ExtractInjectionAPI<PanelPlugin> | undefined;
};

const NODE_NAME = 'panel';

const PanelBlockMenuItem = ({ api }: Props) => {
	const { formatMessage } = useIntl();

	const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
		const triggeredFrom =
			event.nativeEvent instanceof KeyboardEvent || event.nativeEvent.detail === 0
				? INPUT_METHOD.KEYBOARD
				: INPUT_METHOD.MOUSE;
		const inputMethod = INPUT_METHOD.BLOCK_MENU;

		api?.core.actions.execute(({ tr }) => {
			const panelNodeType = expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true)
				? pickPanelTypeForInsertion(tr.selection)
				: tr.doc.type.schema.nodes.panel;
			const command = api?.blockMenu?.commands.transformNode(panelNodeType, {
				inputMethod,
				triggeredFrom,
				targetTypeName: NODE_NAME,
			});
			return command ? command({ tr }) : null;
		});
	};

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			elemBefore={<InformationCircleIcon label="" size="small" />}
		>
			{formatMessage(blockTypeMessages.panel)}
		</ToolbarDropdownItem>
	);
};

export const createPanelBlockMenuItem = (api: ExtractInjectionAPI<PanelPlugin> | undefined) => {
	return (): React.JSX.Element => <PanelBlockMenuItem api={api} />;
};
