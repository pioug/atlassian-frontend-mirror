import React from 'react';

import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar';
import { ToolbarTooltip, ToolbarDropdownMenu } from '@atlaskit/editor-toolbar';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

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

	if (expValEquals('platform_editor_hide_toolbar_tooltips_fix', 'isEnabled', true)) {
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
	}

	return (
		<ToolbarTooltip content={config.tooltip}>
			<ToolbarDropdownMenu
				iconBefore={<Icon label="" />}
				isDisabled={config.isDisabled}
				onClick={config.onClick}
			>
				{children}
			</ToolbarDropdownMenu>
		</ToolbarTooltip>
	);
};
