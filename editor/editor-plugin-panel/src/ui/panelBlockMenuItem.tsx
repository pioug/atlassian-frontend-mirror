import React, { useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import InformationCircleIcon from '@atlaskit/icon/core/information-circle';

import type { PanelPlugin } from '../panelPluginType';

type Props = {
	api: ExtractInjectionAPI<PanelPlugin> | undefined;
};

const nodeName = 'panel';

const PanelBlockMenuItem = ({ api }: Props) => {
	const { formatMessage } = useIntl();
	const selection = useSharedPluginStateSelector(api, 'selection.selection');

	const isPanelSelected = useMemo(() => {
		if (!selection) {
			return false;
		}

		if (selection instanceof NodeSelection) {
			// Note: we are checking for any type of panel, not just of type infopanel
			return selection.node.type.name === nodeName;
		}

		return false;
	}, [selection]);

	const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
		const triggeredFrom =
			event.nativeEvent instanceof KeyboardEvent || event.nativeEvent.detail === 0
				? INPUT_METHOD.KEYBOARD
				: INPUT_METHOD.MOUSE;
		const inputMethod = INPUT_METHOD.BLOCK_MENU;

		selection &&
			api?.core.actions.execute(
				api?.blockMenu?.commands.transformNode(selection.$from.doc.type.schema.nodes.panel, {
					inputMethod,
					triggeredFrom,
				}),
			);
	};

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			isSelected={isPanelSelected}
			elemBefore={<InformationCircleIcon label="" />}
		>
			{formatMessage(blockTypeMessages.panel)}
		</ToolbarDropdownItem>
	);
};

export const createPanelBlockMenuItem = (api: ExtractInjectionAPI<PanelPlugin> | undefined) => {
	return () => <PanelBlockMenuItem api={api} />;
};
