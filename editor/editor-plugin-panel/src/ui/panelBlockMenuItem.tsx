import React, { useMemo } from 'react';

import { useIntl } from 'react-intl-next';

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

	const handleClick = () => {
		api?.core.actions.execute(api?.blockMenu?.commands.formatNode(nodeName));
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
