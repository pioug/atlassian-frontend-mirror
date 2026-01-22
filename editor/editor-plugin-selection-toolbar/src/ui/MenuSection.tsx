import React from 'react';

import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';

import type { SelectionToolbarPlugin } from '../selectionToolbarPluginType';

type MenuSectionProps = {
	api: ExtractInjectionAPI<SelectionToolbarPlugin> | undefined;
	children: React.ReactNode;
};

const usePluginState = (_api?: ExtractInjectionAPI<SelectionToolbarPlugin> | undefined) => {
	const { editorViewMode } = useEditorToolbar();

	return {
		editorViewMode,
	};
};

export const MenuSection = ({ children, api }: MenuSectionProps): React.JSX.Element | null => {
	const { editorViewMode } = usePluginState(api);
	const isEdit = editorViewMode === 'edit';

	if (!isEdit) {
		return null;
	}

	return <ToolbarDropdownItemSection hasSeparator={isEdit}>{children}</ToolbarDropdownItemSection>;
};
