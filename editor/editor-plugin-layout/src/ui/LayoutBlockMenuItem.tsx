import React, { useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import LayoutTwoColumnsIcon from '@atlaskit/icon/core/layout-two-columns';

import type { LayoutPlugin } from '../layoutPluginType';

type Props = {
	api: ExtractInjectionAPI<LayoutPlugin> | undefined;
};

const LayoutBlockMenuItem = ({ api }: Props) => {
	const { formatMessage } = useIntl();
	const selection = useSharedPluginStateSelector(api, 'selection.selection');

	const isLayoutSelected = useMemo(() => {
		if (!selection) {
			return false;
		}

		if (selection instanceof NodeSelection) {
			return selection.node.type.name === 'layoutSection';
		}

		return false;
	}, [selection]);

	const handleClick = () => {
		api?.core.actions.execute(api?.blockMenu?.commands.formatNode('layoutSection'));
	};

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			isSelected={isLayoutSelected}
			elemBefore={<LayoutTwoColumnsIcon label="" />}
		>
			{formatMessage(blockMenuMessages.layout)}
		</ToolbarDropdownItem>
	);
};

export const createLayoutBlockMenuItem = (api: ExtractInjectionAPI<LayoutPlugin>) => {
	return () => <LayoutBlockMenuItem api={api} />;
};
