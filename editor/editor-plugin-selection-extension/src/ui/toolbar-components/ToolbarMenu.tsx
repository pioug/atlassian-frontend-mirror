import React from 'react';

import { useEditorToolbar } from '@atlaskit/editor-common/toolbar/context';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar/selection-toolbar-plugin-type';
import { ToolbarDropdownMenu } from '@atlaskit/editor-toolbar/toolbar-dropdown-menu';
import { ToolbarTooltip } from '@atlaskit/editor-toolbar/toolbar-tooltip';

import type { SelectionExtensionPlugin } from '../../selectionExtensionPluginType';
import type { ExtensionToolbarItemConfiguration } from '../../types';

type ToolbarMenuProps = React.PropsWithChildren<{
	api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined;
	config: ExtensionToolbarItemConfiguration;
}>;

const usePluginState = (_api?: ExtractInjectionAPI<SelectionToolbarPlugin> | undefined) => {
	const { editorToolbarDockingPreference } = useEditorToolbar();

	return {
		editorToolbarDockingPreference,
	};
};

export const ToolbarMenu = ({
	api,
	config,
	children,
}: ToolbarMenuProps): React.JSX.Element | null => {
	const { editorToolbarDockingPreference } = usePluginState(api);

	const isDockedAtTop = editorToolbarDockingPreference === 'top';

	if (isDockedAtTop) {
		return null;
	}

	const Icon = config.icon;

	return (
		<ToolbarDropdownMenu
			iconBefore={<Icon label="" />}
			isDisabled={config.isDisabled}
			onClick={config.onClick}
			tooltipComponent={<ToolbarTooltip content={config.tooltip} />}
		>
			{children}
		</ToolbarDropdownMenu>
	);
};
