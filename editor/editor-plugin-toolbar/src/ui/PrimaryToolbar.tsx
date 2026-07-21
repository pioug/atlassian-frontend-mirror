import React from 'react';

import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { EditorAppearance } from '@atlaskit/editor-common/types';
import { PrimaryToolbar as PrimaryToolbarBase } from '@atlaskit/editor-toolbar';
import type { BreakpointPreset } from '@atlaskit/editor-toolbar';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

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
			testId={
				expValEquals('editor_a11y__primary-toolbar-aria-label_fy27', 'isEnabled', true)
					? 'editor-primary-toolbar'
					: undefined
			}
			label={
				expValEquals('editor_a11y__primary-toolbar-aria-label_fy27', 'isEnabled', true)
					? undefined
					: 'Primary Toolbar'
			}
			breakpointPreset={getBreakpointPreset(breakpointPreset, editorAppearance)}
		>
			{children}
		</PrimaryToolbarBase>
	);
};
