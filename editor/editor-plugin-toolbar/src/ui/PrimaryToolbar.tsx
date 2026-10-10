import React from 'react';

import { useEditorToolbar } from '@atlaskit/editor-common/toolbar/context';
import type { EditorAppearance } from '@atlaskit/editor-common/types/editor-appearance';
import type { BreakpointPreset } from '@atlaskit/editor-toolbar/responsive-container';
import { PrimaryToolbar as PrimaryToolbarBase } from '@atlaskit/editor-toolbar/toolbar';

type PrimaryToolbarProps = {
	breakpointPreset?: BreakpointPreset;
	children: React.ReactNode;
};

const isFullPage = (editorAppearance: EditorAppearance) => {
	return editorAppearance === 'full-page' || editorAppearance === 'full-width';
};

const getBreakpointPreset = (
	breakpointPreset: BreakpointPreset | undefined,
	editorAppearance?: EditorAppearance,
) => {
	if (breakpointPreset) {
		return breakpointPreset;
	}
	return editorAppearance && isFullPage(editorAppearance) ? 'fullpage' : 'reduced';
};

export const PrimaryToolbar = ({
	children,
	breakpointPreset,
}: PrimaryToolbarProps): React.JSX.Element => {
	const { editorAppearance } = useEditorToolbar();

	return (
		<PrimaryToolbarBase
			testId="editor-primary-toolbar"
			breakpointPreset={getBreakpointPreset(breakpointPreset, editorAppearance)}
		>
			{children}
		</PrimaryToolbarBase>
	);
};
