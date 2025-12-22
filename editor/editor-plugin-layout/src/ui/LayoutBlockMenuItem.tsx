import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import LayoutTwoColumnsIcon from '@atlaskit/icon/core/layout-two-columns';

import type { LayoutPlugin } from '../layoutPluginType';

type Props = {
	api: ExtractInjectionAPI<LayoutPlugin> | undefined;
};

const NODE_NAME = 'layoutSection';

const LayoutBlockMenuItem = ({ api }: Props) => {
	const { formatMessage } = useIntl();

	const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
		const triggeredFrom =
			event.nativeEvent instanceof KeyboardEvent || event.nativeEvent.detail === 0
				? INPUT_METHOD.KEYBOARD
				: INPUT_METHOD.MOUSE;
		const inputMethod = INPUT_METHOD.BLOCK_MENU;

		api?.core.actions.execute(({ tr }) => {
			const command = api?.blockMenu?.commands.transformNode(
				tr.doc.type.schema.nodes.layoutSection,
				{
					inputMethod,
					triggeredFrom,
					targetTypeName: NODE_NAME,
				},
			);
			return command ? command({ tr }) : null;
		});
	};

	const isTransfromToPanelDisabled = api?.blockMenu?.actions.isTransformOptionDisabled(NODE_NAME);
	if (isTransfromToPanelDisabled) {
		return null;
	}

	return (
		<ToolbarDropdownItem onClick={handleClick} elemBefore={<LayoutTwoColumnsIcon label="" />}>
			{formatMessage(blockMenuMessages.layout)}
		</ToolbarDropdownItem>
	);
};

export const createLayoutBlockMenuItem = (api: ExtractInjectionAPI<LayoutPlugin> | undefined) => {
	return (): React.JSX.Element => <LayoutBlockMenuItem api={api} />;
};
