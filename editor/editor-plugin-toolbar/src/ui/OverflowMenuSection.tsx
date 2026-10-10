import React from 'react';

import { useEditorToolbar } from '@atlaskit/editor-common/toolbar/context';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar/toolbar-dropdown-item-section';

type OverflowMenuSectionProps = {
	children: React.ReactNode;
};

export const OverflowMenuSection = ({ children }: OverflowMenuSectionProps): React.JSX.Element => {
	const { editorViewMode } = useEditorToolbar();
	const isEdit = editorViewMode === 'edit';

	// only show separator in edit mode, when the pinned toolbar option is available
	return <ToolbarDropdownItemSection hasSeparator={isEdit}>{children}</ToolbarDropdownItemSection>;
};
