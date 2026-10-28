import React from 'react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { clickAreaClickHandler } from '../click-area-helper';
import { ClickAreaBlockContainer } from './clickAreaBlock';

export interface Props {
	children?: React.ReactNode;
	editorDisabled?: boolean;
	editorView?: EditorView;
}

export const ClickAreaBlock = ({
	editorView,
	editorDisabled,
	children,
}: Props): React.JSX.Element => {
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
		<ClickAreaBlockContainer
			data-editor-click-wrapper
			data-testid="click-wrapper"
			onMouseDown={handleMouseDown}
			// This div is a presentational container that captures mouse events
			// for programmatic editor focus management, not user interaction.
			role="presentation"
		>
			{children}
		</ClickAreaBlockContainer>
	);
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export default ClickAreaBlock;
