import React from 'react';

import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { SeparatorPosition } from '@atlaskit/editor-toolbar';
import { ToolbarSection } from '@atlaskit/editor-toolbar';

export const OverflowSection = ({
	children,
	hasSeparator,
	testId,
}: {
	children: React.ReactNode;
	hasSeparator?: boolean | SeparatorPosition;
	testId?: string;
}): React.JSX.Element | null => {
	const { editorAppearance } = useEditorToolbar();
	if (editorAppearance === 'full-page') {
		return null;
	}

	return (
		<ToolbarSection hasSeparator={hasSeparator} testId={testId}>
			{children}
		</ToolbarSection>
	);
};
