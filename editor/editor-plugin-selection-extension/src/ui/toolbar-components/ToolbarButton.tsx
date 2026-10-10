import React from 'react';

import { useEditorToolbar } from '@atlaskit/editor-common/toolbar/context';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar/selection-toolbar-plugin-type';
import { ToolbarButton as BaseToolbarButton } from '@atlaskit/editor-toolbar/toolbar-button';
import { ToolbarTooltip } from '@atlaskit/editor-toolbar/toolbar-tooltip';

import type { SelectionExtensionPlugin } from '../../selectionExtensionPluginType';
import type { ExtensionToolbarItemConfiguration } from '../../types';

type ToolbarButtonProps = {
	api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined;
	config: ExtensionToolbarItemConfiguration;
};

const usePluginState = (_api?: ExtractInjectionAPI<SelectionToolbarPlugin> | undefined) => {
	const { editorToolbarDockingPreference } = useEditorToolbar();

	return {
		editorToolbarDockingPreference,
	};
};

export const ToolbarButton = ({ api, config }: ToolbarButtonProps): React.JSX.Element | null => {
	const { editorToolbarDockingPreference } = usePluginState(api);

	const isDockedAtTop = editorToolbarDockingPreference === 'top';

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
