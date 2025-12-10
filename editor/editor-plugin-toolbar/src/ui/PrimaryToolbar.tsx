import React from 'react';

import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { EditorAppearance } from '@atlaskit/editor-common/types';
import {
	PrimaryToolbar as PrimaryToolbarBase,
	type BreakpointPreset,
} from '@atlaskit/editor-toolbar';

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

export const PrimaryToolbar = ({ children, breakpointPreset }: PrimaryToolbarProps): React.JSX.Element => {
	const { editorAppearance } = useEditorToolbar();

	return (
		<PrimaryToolbarBase
			label="Primary Toolbar"
			reducedBreakpoints={editorAppearance !== 'full-page'}
			breakpointPreset={getBreakpointPreset(breakpointPreset, editorAppearance)}
		>
			{children}
		</PrimaryToolbarBase>
	);
};
