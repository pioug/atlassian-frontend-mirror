import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import InformationCircleIcon from '@atlaskit/icon/core/information-circle';
import { fg } from '@atlaskit/platform-feature-flags';

import type { PanelPlugin } from '../panelPluginType';

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
			const command = api?.blockMenu?.commands.transformNode(tr.doc.type.schema.nodes.panel, {
				inputMethod,
				triggeredFrom,
				targetTypeName: NODE_NAME,
			});
			return command ? command({ tr }) : null;
		});
	};

	// [FEATURE FLAG: platform_editor_block_menu_v2_patch_3]
	// Adds size="small" to icons for better visual consistency in block menu.
	// To clean up: remove conditional, keep only size="small" version.
	const iconSize = fg('platform_editor_block_menu_v2_patch_3') ? 'small' : undefined;

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			elemBefore={<InformationCircleIcon label="" size={iconSize} />}
		>
			{formatMessage(blockTypeMessages.panel)}
		</ToolbarDropdownItem>
	);
};

export const createPanelBlockMenuItem = (api: ExtractInjectionAPI<PanelPlugin> | undefined) => {
	return (): React.JSX.Element => <PanelBlockMenuItem api={api} />;
};
