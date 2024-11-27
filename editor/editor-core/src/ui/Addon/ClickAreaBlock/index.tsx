/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { clickAreaClickHandler } from '../click-area-helper';

const clickWrapper = css({
	flexGrow: 1,
	height: '100%',
});

export interface Props {
	editorView?: EditorView;
	children?: React.ReactNode;
	editorDisabled?: boolean;
}

export const ClickAreaBlock = ({ editorView, editorDisabled, children }: Props) => {
	const handleMouseDown = React.useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			if (!editorView) {
				return;
			}

			if (!editorDisabled) {
				clickAreaClickHandler(editorView, event);
			}
		},
		[editorView, editorDisabled],
	);

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div data-testid="click-wrapper" css={clickWrapper} onMouseDown={handleMouseDown}>
			{children}
		</div>
	);
};

export default ClickAreaBlock;
