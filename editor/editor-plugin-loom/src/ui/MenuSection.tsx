import React from 'react';

import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
import { conditionalHooksFactory } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { LoomPlugin } from '../loomPluginType';

type MenuSectionProps = {
	api: ExtractInjectionAPI<LoomPlugin> | undefined;
	children: React.ReactNode;
};

/**
 * !! When removing platform_editor_toolbar_aifc_patch_3 also remove package dependency on `@atlaskit/editor-plugin-view-mode`.
 */
const usePluginState = conditionalHooksFactory(
	() => expValEquals('platform_editor_toolbar_aifc_patch_3', 'isEnabled', true),
	(api?: ExtractInjectionAPI<LoomPlugin> | undefined) => {
		const { editorViewMode } = useEditorToolbar();

		return {
			editorViewMode,
		};
	},
	(api?: ExtractInjectionAPI<LoomPlugin> | undefined) => {
		const editorViewMode = useSharedPluginStateSelector(api, 'editorViewMode.mode');

		return {
			editorViewMode,
		};
	},
);

export const MenuSection = ({ children, api }: MenuSectionProps) => {
	const { editorViewMode } = usePluginState(api);
	const isEdit = editorViewMode === 'edit';

	if (!isEdit) {
		return null;
	}

	return <ToolbarDropdownItemSection hasSeparator={isEdit}>{children}</ToolbarDropdownItemSection>;
};
