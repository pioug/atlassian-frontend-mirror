import React from 'react';

import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';

type OverflowMenuSectionProps = {
	children: React.ReactNode;
};

export const OverflowMenuSection = ({ children }: OverflowMenuSectionProps) => {
	const { editorViewMode } = useEditorToolbar();
	const isEdit = editorViewMode === 'edit';

	// only show separator in edit mode, when the pinned toolbar option is available
	return <ToolbarDropdownItemSection hasSeparator={isEdit}>{children}</ToolbarDropdownItemSection>;
};
