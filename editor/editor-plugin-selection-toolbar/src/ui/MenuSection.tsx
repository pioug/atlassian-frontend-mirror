import React from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';

import type { SelectionToolbarPlugin } from '../selectionToolbarPluginType';

type MenuSectionProps = {
	api: ExtractInjectionAPI<SelectionToolbarPlugin> | undefined;
	children: React.ReactNode;
};

export const MenuSection = ({ children, api }: MenuSectionProps) => {
	const viewMode = useSharedPluginStateSelector(api, 'editorViewMode.mode');
	const isEdit = viewMode === 'edit';

	if (!isEdit) {
		return null;
	}

	return <ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>;
};
