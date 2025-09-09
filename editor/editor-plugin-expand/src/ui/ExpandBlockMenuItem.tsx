import React, { useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import { toolbarInsertBlockMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import ExpandElementIcon from '@atlaskit/icon-lab/core/expand-element';

import type { ExpandPlugin } from '../types';

type Props = {
	api: ExtractInjectionAPI<ExpandPlugin> | undefined;
};

const nodeName = 'expand';

const ExpandBlockMenuItem = ({ api }: Props) => {
	const { formatMessage } = useIntl();
	const selection = useSharedPluginStateSelector(api, 'selection.selection');

	const isExpandSelected = useMemo(() => {
		if (!selection) {
			return false;
		}

		if (selection instanceof NodeSelection) {
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
			isSelected={isExpandSelected}
			elemBefore={<ExpandElementIcon label="" />}
		>
			{formatMessage(toolbarInsertBlockMessages.expand)}
		</ToolbarDropdownItem>
	);
};

export const createExpandBlockMenuItem = (api: ExtractInjectionAPI<ExpandPlugin> | undefined) => {
	return () => <ExpandBlockMenuItem api={api} />;
};
