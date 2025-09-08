import React from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';

import type { LoomPlugin } from '../loomPluginType';

type MenuSectionProps = {
	api: ExtractInjectionAPI<LoomPlugin> | undefined;
	children: React.ReactNode;
};

export const MenuSection = ({ children, api }: MenuSectionProps) => {
	const viewMode = useSharedPluginStateSelector(api, 'editorViewMode.mode');
	const isEdit = viewMode === 'edit';

	return <ToolbarDropdownItemSection hasSeparator={isEdit}>{children}</ToolbarDropdownItemSection>;
};
