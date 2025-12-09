import React from 'react';

import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';

type OverflowMenuSectionProps = {
	children: React.ReactNode;
};

export const OverflowMenuSection = ({
	children,
}: OverflowMenuSectionProps): React.JSX.Element | null => {
	const { editorViewMode } = useEditorToolbar();
	const isEdit = editorViewMode === 'edit';

	if (!isEdit) {
		return null;
	}

	return <ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>;
};
