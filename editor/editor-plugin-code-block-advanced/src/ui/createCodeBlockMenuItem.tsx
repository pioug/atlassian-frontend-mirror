import React, { useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';

import type { CodeBlockAdvancedPlugin } from '../codeBlockAdvancedPluginType';

type Props = {
	api: ExtractInjectionAPI<CodeBlockAdvancedPlugin> | undefined;
};

const nodeName = 'codeBlock';

const CodeBlockMenuItem = ({ api }: Props) => {
	const { formatMessage } = useIntl();
	const selection = useSharedPluginStateSelector(api, 'selection.selection');

	const isCodeBlockSelected = useMemo(() => {
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
			isSelected={isCodeBlockSelected}
			elemBefore={<AngleBracketsIcon label="" />}
		>
			{formatMessage(blockMenuMessages.codeBlock)}
		</ToolbarDropdownItem>
	);
};

export const createCodeBlockMenuItem = (api: ExtractInjectionAPI<CodeBlockAdvancedPlugin>) => {
	return () => <CodeBlockMenuItem api={api} />;
};
