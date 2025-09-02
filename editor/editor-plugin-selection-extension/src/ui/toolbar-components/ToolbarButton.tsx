import React from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { ToolbarTooltip, ToolbarButton as BaseToolbarButton } from '@atlaskit/editor-toolbar';

import type { SelectionExtensionPlugin } from '../../selectionExtensionPluginType';
import type { ExtensionToolbarItemConfiguration } from '../../types';

type ToolbarButtonProps = {
	api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined;
	config: ExtensionToolbarItemConfiguration;
};

export const ToolbarButton = ({ api, config }: ToolbarButtonProps) => {
	const dockingPreference = useSharedPluginStateSelector(
		api,
		'userPreferences.preferences.toolbarDockingPosition',
	);

	const isDockedAtTop = dockingPreference === 'top';

	if (isDockedAtTop) {
		return null;
	}

	const Icon = config.icon;

	return (
		<ToolbarTooltip content={config.tooltip}>
			<BaseToolbarButton
				iconBefore={<Icon label="" />}
				isDisabled={config.isDisabled}
				onClick={config.onClick}
			>
				{config.label}
			</BaseToolbarButton>
		</ToolbarTooltip>
	);
};
