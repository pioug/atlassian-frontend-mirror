import React from 'react';

import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import { PrimaryToolbar as PrimaryToolbarBase } from '@atlaskit/editor-toolbar';

type PrimaryToolbarProps = {
	children: React.ReactNode;
};

export const PrimaryToolbar = ({ children }: PrimaryToolbarProps) => {
	const { editorAppearance } = useEditorToolbar();

	return (
		<PrimaryToolbarBase
			label="Primary Toolbar"
			reducedBreakpoints={editorAppearance !== 'full-page'}
		>
			{children}
		</PrimaryToolbarBase>
	);
};
