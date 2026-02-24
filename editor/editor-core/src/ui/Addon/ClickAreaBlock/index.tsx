/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { clickAreaClickHandler } from '../click-area-helper';

const clickWrapper = css({
	flexGrow: 1,
	height: '100%',
});

export interface Props {
	children?: React.ReactNode;
	editorDisabled?: boolean;
	editorView?: EditorView;
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
		<div
			data-editor-click-wrapper
			data-testid="click-wrapper"
			css={clickWrapper}
			onMouseDown={handleMouseDown}
			// This div is a presentational container that captures mouse events
			// for programmatic editor focus management, not user interaction.
			role={
				expValEquals('platform_editor_a11y_eslint_fix', 'isEnabled', true)
					? 'presentation'
					: undefined
			}
		>
			{children}
		</div>
	);
};

export default ClickAreaBlock;
